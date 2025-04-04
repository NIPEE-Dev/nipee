<?php

namespace App\Http\Controllers;

use App\Models\StudentsPreRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Enums\Candidate\StudyingLevelEnum;
use App\Models\Users\User;
use App\Models\Candidate;
use App\Mail\PreRegistrationStudentSuccess;
use App\Mail\PreRegistrationStudentsReject;
use App\Mail\PreRegistrationStudentsApproveSuccess;
use App\Models\SchoolMember;
use App\Models\Shared\Contact;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class StudentsPreRegistrationController extends Controller
{
    public function index()
    {
        try {
            $user = Auth::user();
            $roleId = $user->roles[0]->id;
            $registrations = StudentsPreRegistration::with(['school', 'course'])->orderBy('created_at', 'desc');
            if ($roleId === 10) {
                $registrations->where('school_id', $user->school[0]->id ?? 0);
            }

            return response()->json([
                'message' => 'Pré-registros retornados com sucesso.',
                'data' => $registrations->get(),
            ], 200);
        } catch (\Exception $e) {
            Log::error('Erro ao buscar todos os pré-registros:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Ocorreu um erro ao buscar os pré-registros. Tente novamente mais tarde.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $preRegistration = StudentsPreRegistration::with(['school', 'course'])->findOrFail($id);

            $educationLevel = StudyingLevelEnum::tryFrom($preRegistration->education_level);
            $preRegistration->education_level = $educationLevel ? StudyingLevelEnum::getLabel($educationLevel) : 'Nível de educação desconhecido';

            return response()->json([
                'message' => 'Pré-registro encontrado com sucesso.',
                'data' => $preRegistration,
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Pré-registro não encontrado.',
                'error' => $e->getMessage(),
            ], 404);
        } catch (\Exception $e) {
            Log::error('Erro ao buscar o pré-registro:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Ocorreu um erro ao buscar o pré-registro. Tente novamente mais tarde.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function approve($id)
    {
        DB::beginTransaction();

        try {
            $preRegistration = StudentsPreRegistration::findOrFail($id);

            $preRegistration->status = 'Aprovado';
            $preRegistration->approved_at = now();
            $preRegistration->rejection_reason = null;
            $preRegistration->reject_at = null;
            $preRegistration->save();
            $birthDate = $preRegistration->birth_date->format('d/m/Y');
            $user = User::create([
                'email' => $preRegistration->email,
                'password' => bcrypt('password'),
                'name' => $preRegistration->full_name,
                'end_hour' => '23:59',
                'role_id' => 13,
            ]);
            $candidate = Candidate::create([
                'name' => $preRegistration->full_name,
                'birth_day' => $birthDate,
                'cpf' => $preRegistration->nif,
                'rg' => '',
                'gender' => 'F',
                'studying_level' => $preRegistration->education_level,
                'course' => $preRegistration->course,
                'semester' => 0,
                'period' => 'M',
                'interest' => 'ES',
                'user_id' => $user->id,
                'resume' => $preRegistration->resume,
                'volunteer_experience' => $preRegistration->volunteer_experience,
            ]);
            SchoolMember::create([ 'user_id' => $user->id, 'school_id' => $preRegistration->school_id ]);
            $candidate->contact()->save(new Contact([ 'name' => $preRegistration->full_name, 'phone' => $preRegistration->phone, 'email' => $preRegistration->email ]));
            $user->roles()->attach(13);

            $file = explode('/', $preRegistration->resume)[1];
            $splitFile = explode('.', $file);
            $name = $splitFile[0];
            $extension = $splitFile[1];
            $from = 'public/' . $preRegistration->resume;
            $to = 'generated_documents/guarulhos/' . $file;
            $copy = Storage::copy($from, $to);
            $size = Storage::disk('public')->size($preRegistration->resume);
            $fileData = [
                'filename' => $name,
                'original_filename' => 'Curriculum Vitae',
                'file_extension' => $extension,
                'filesize' => $size,
                'type' => 'Curriculum Vitae',
            ];
            $candidate->documents()->create($fileData);

            $passwordResetLink = 'https://nipee.org/redefinir-senha?email=' . urlencode($user->email);
            /* Mail::to($preRegistration->email)->send(
                new PreRegistrationStudentsApproveSuccess(
                    $preRegistration->full_name,
                    $passwordResetLink
                )
            ); */

            DB::commit();

            return response()->json([
                'message' => 'Candidato aprovado, usuário do candidato criado com sucesso!',
                /* 'data' => $candidate, */
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Pré-registro não encontrado.',
                'error' => $e->getMessage(),
            ], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erro ao aprovar o candidato:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Ocorreu um erro ao tentar aprovar o candidato. Tente novamente mais tarde.',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    }

    public function reject(Request $request, $id)
    {
        try {
            $preRegistration = StudentsPreRegistration::findOrFail($id);

            $validatedData = Validator::make($request->all(), [
                'rejection_reason' => 'required|string|max:500',
            ]);

            if ($validatedData->fails()) {
                return response()->json([
                    'message' => 'O motivo da rejeição é obrigatório.',
                    'errors' => $validatedData->errors(),
                ], 422);
            }

            $preRegistration->status = 'Rejeitado';
            $preRegistration->reject_at = now();
            $preRegistration->rejection_reason = $request->input('rejection_reason');
            $preRegistration->approved_at = null;
            $preRegistration->save();

            Mail::to($preRegistration->email)->send(new PreRegistrationStudentsReject(
                $preRegistration->full_name,
                $preRegistration->rejection_reason
            ));

            return response()->json([
                'message' => 'candidato rejeitada com sucesso.',
                'data' => $preRegistration,
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Pré-registro não encontrado.',
                'error' => $e->getMessage(),
            ], 404);
        } catch (\Exception $e) {
            Log::error('Erro ao rejeitar a candidato:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Ocorreu um erro ao tentar rejeitar a candidato. Tente novamente mais tarde.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $studentData = $request->input('aluno');

            $validatedData = Validator::make($studentData, [
                'full_name' => 'required|string|max:255',
                'birth_date' => 'required|date',
                'email' => 'required|email|max:255|unique:students_pre_registrations,email',
                'phone' => 'nullable|string|max:20',
                'education_level' => 'required|string|max:100',
                'interest_area' => 'required|string|max:100',
                'volunteer_experience' => 'nullable|string|max:500',
                'resume' => 'required|string',
                'school_id' => 'required|exists:schools,id'
            ]);

            if ($validatedData->fails()) {
                return response()->json([
                    'message' => 'Parece que há alguns erros nos dados fornecidos.',
                    'errors' => $validatedData->errors(),
                ], 422);
            }

            $existingUser = User::where('email', $studentData['email'])->first();
            if ($existingUser) {
                return response()->json([
                    'message' => 'O e-mail fornecido já está registrado em nosso sistema.',
                ], 400);
            }

            if (isset($studentData['resume']) && strpos($studentData['resume'], 'data:') === 0) {
                $fileData = substr($studentData['resume'], strpos($studentData['resume'], ',') + 1);
                $fileMimeType = explode(';', explode(':', $studentData['resume'])[1])[0];

                $fileContents = base64_decode($fileData);

                $fileName = uniqid() . '.' . ($fileMimeType == 'application/pdf' ? 'pdf' : 'docx');

                $path = Storage::disk('public')->put('resumes/' . $fileName, $fileContents);

                if ($path) {
                    $studentData['resume'] = 'resumes/' . $fileName;
                }
            }

            $preRegistration = StudentsPreRegistration::create($studentData);

            Mail::to($studentData['email'])->send(new PreRegistrationStudentSuccess($studentData['full_name'], $studentData['full_name']));

            return response()->json([
                'message' => 'Seu pré-registro foi realizado com sucesso!',
                'data' => $preRegistration,
            ], 201);

        } catch (\Exception $e) {
            Log::error('Erro ao criar pré-registro:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Ocorreu um erro ao tentar criar o pré-registro. Tente novamente mais tarde.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $preRegistration = StudentsPreRegistration::findOrFail($id);

            $studentData = $request->input('aluno');

            if (!$studentData || !is_array($studentData)) {
                return response()->json([
                    'message' => 'Os dados do aluno são obrigatórios.',
                ], 400);
            }

            $validatedData = Validator::make($studentData, [
                'full_name' => 'required|string|max:255',
                'birth_date' => 'required|date',
                'email' => 'required|email|max:255|unique:students_pre_registrations,email,' . $id,
                'phone' => 'nullable|string|max:20',
                'education_level' => 'required|string|max:100',
                'interest_area' => 'required|string|max:100',
                'volunteer_experience' => 'nullable|string|max:500',
                'resume' => 'required|string',
            ]);

            if ($validatedData->fails()) {
                return response()->json([
                    'message' => 'Parece que há alguns erros nos dados fornecidos.',
                    'errors' => $validatedData->errors(),
                ], 422);
            }

            if (isset($studentData['resume']) && strpos($studentData['resume'], 'data:') === 0) {
                $fileData = substr($studentData['resume'], strpos($studentData['resume'], ',') + 1);
                $fileMimeType = explode(';', explode(':', $studentData['resume'])[1])[0];

                $fileContents = base64_decode($fileData);

                $fileName = uniqid() . '.' . ($fileMimeType == 'application/pdf' ? 'pdf' : 'docx');

                $path = Storage::disk('public')->put('resumes/' . $fileName, $fileContents);

                if ($path) {
                    $studentData['resume'] = 'resumes/' . $fileName;
                }
            }

            $preRegistration->update($studentData);

            return response()->json([
                'message' => 'O pré-registro foi atualizado com sucesso!',
                'data' => $preRegistration,
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Pré-registro não encontrado.',
                'error' => $e->getMessage(),
            ], 404);
        } catch (\Exception $e) {
            Log::error('Erro ao atualizar pré-registro:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Ocorreu um erro ao tentar atualizar o pré-registro. Tente novamente mais tarde.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    protected function getEducationLevelAttribute($value)
    {
        $educationLevel = StudyingLevelEnum::tryFrom($value);
        return $educationLevel ? StudyingLevelEnum::getLabel($educationLevel) : 'Nível de educação desconhecido';
    }
}
