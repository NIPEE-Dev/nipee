<?php

namespace App\Http\Controllers;

use App\Models\CompanyPreRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Models\Users\User;
use App\Models\Company\Company;
use App\Mail\PreRegistrationSuccess;
use App\Mail\PreRegistrationRReject;
use App\Models\Shared\Contact;
use App\Models\Shared\Responsible;
use App\Mail\PreRegistrationApproveSuccess;
use App\Mail\PreRegistrationNoticeMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class CompanyPreRegistrationController extends Controller
{
    public function store(Request $request)
    {
        try {
            $empresaData = $request->input('empresa');

            $validatedData = Validator::make($empresaData, [
                'company_name' => 'required|string|max:255',
                'nif' => 'required|string|max:50|unique:company_pre_registrations,nif',
                'representative_name' => 'required|string|max:255',
                'corporate_email' => 'required|email|max:255|unique:company_pre_registrations,corporate_email',
                'phone' => 'nullable|string|max:20',
                'sector' => 'required|string|max:100',
                'student_vacancies' => 'nullable|integer|min:0',
                'message' => 'nullable|string|max:500',
            ]);

            if ($validatedData->fails()) {
                $errorMessages = [];
                foreach ($validatedData->errors()->toArray() as $field => $errors) {
                    foreach ($errors as $error) {
                        switch ($field) {
                            case 'nif':
                                $errorMessages[$field] = 'Este NIF já está cadastrado.';
                                break;
                            case 'corporate_email':
                                $errorMessages[$field] = 'Este e-mail já está em uso.';
                                break;
                            default:
                                $errorMessages[$field] = $error;
                                break;
                        }
                    }
                }

                return response()->json([
                    'message' => 'Parece que há alguns erros nos dados fornecidos.',
                    'errors' => $errorMessages,
                ], 422);
            }

            $existingUser = User::where('email', $empresaData['corporate_email'])->first();
            if ($existingUser) {
                return response()->json([
                    'message' => 'O e-mail corporativo fornecido já está registrado em nosso sistema.',
                ], 400);
            }

            $preRegistration = CompanyPreRegistration::create($empresaData);
            try {
                Mail::to($empresaData['corporate_email'])->send(new PreRegistrationSuccess($empresaData['company_name'], $empresaData['representative_name']));
                Mail::to('contacto@nipee.org')->send(new PreRegistrationNoticeMail());
            } catch (\Throwable $th) {
            }

            return response()->json([
                'message' => 'Seu pré-registro foi realizado com sucesso! E-mail de confirmação enviado.',
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

    public function index()
    {
        try {
            $registrations = CompanyPreRegistration::orderBy('created_at', 'desc')->get();

            return response()->json([
                'message' => 'Pré-registros retornados com sucesso.',
                'data' => $registrations,
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
            $preRegistration = CompanyPreRegistration::findOrFail($id);

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
        try {
            $preRegistration = CompanyPreRegistration::findOrFail($id);

            $preRegistration->status = 'Aprovado';
            $preRegistration->approved_at = now();
            $preRegistration->rejection_reason = null;
            $preRegistration->reject_at = null;
            $preRegistration->save();

            $user = User::create([
                'email' => $preRegistration->corporate_email,
                'password' => bcrypt('password'),
                'name' => $preRegistration->representative_name,
                'end_hour' => '23:59',
                'role_id' => 14,
            ]);
            $user->roles()->attach(14);

            $company = Company::create([
                'corporate_name' => $preRegistration->company_name,
                'fantasy_name' => $preRegistration->company_name,
                'type' => 'PJ',
                'cnpj' => $preRegistration->nif,
                'branch_of_activity' => $preRegistration->sector,
                'supervisor' => $preRegistration->representative_name,
                'observations' => $preRegistration->message,
                'start_contract_vigence' => '',
                'cae' => '',
                'sector' => '',
                'user_id' => $user->id,
            ]);

            $company->contact()->save(new Contact(['name' => $preRegistration->company_name, 'phone' => $preRegistration->phone, 'email' => $preRegistration->corporate_email]));

            $company->responsible()->save(new Responsible(['name' => $preRegistration->representative_name, 'phone' => $preRegistration->phone, 'email' => $preRegistration->corporate_email, 'document' => $preRegistration->nif]));

            $frontendUrl = config('app.frontend_url');
            $passwordResetLink = $frontendUrl . '/redefinir-senha?email=' . urlencode($user->email);

            Mail::to($preRegistration->corporate_email)->send(
                new PreRegistrationApproveSuccess(
                    $preRegistration->representative_name,
                    $passwordResetLink
                )
            );

            return response()->json([
                'message' => 'Empresa aprovada, usuário e cadastro da empresa criados com sucesso!',
                /* 'data' => $company, */
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Pré-registro não encontrado.',
                'error' => $e->getMessage(),
            ], 404);
        } catch (\Exception $e) {
            Log::error('Erro ao aprovar a empresa:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Ocorreu um erro ao tentar aprovar a empresa. Tente novamente mais tarde.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function reject(Request $request, $id)
    {
        try {
            $preRegistration = CompanyPreRegistration::findOrFail($id);

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

            /* A */

            return response()->json([
                'message' => 'Empresa rejeitada com sucesso.',
                'data' => $preRegistration,
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Pré-registro não encontrado.',
                'error' => $e->getMessage(),
            ], 404);
        } catch (\Exception $e) {
            Log::error('Erro ao rejeitar a empresa:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Ocorreu um erro ao tentar rejeitar a empresa. Tente novamente mais tarde.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $preRegistration = CompanyPreRegistration::findOrFail($id);

            $empresaData = $request->input('empresa');
            $validatedData = Validator::make($empresaData, [
                'company_name' => 'required|string|max:255',
                'nif' => 'required|string|max:50|unique:company_pre_registrations,nif,' . $id,
                'representative_name' => 'required|string|max:255',
                'corporate_email' => 'required|email|max:255|unique:company_pre_registrations,corporate_email,' . $id,
                'phone' => 'nullable|string|max:20',
                'sector' => 'required|string|max:100',
                'student_vacancies' => 'nullable|integer|min:0',
                'message' => 'nullable|string|max:500',
            ]);

            if ($validatedData->fails()) {
                $errorMessages = [];
                foreach ($validatedData->errors()->toArray() as $field => $errors) {
                    foreach ($errors as $error) {
                        switch ($field) {
                            case 'nif':
                                $errorMessages[$field] = 'Este NIF já está cadastrado.';
                                break;
                            case 'corporate_email':
                                $errorMessages[$field] = 'Este e-mail já está em uso.';
                                break;
                            default:
                                $errorMessages[$field] = $error;
                                break;
                        }
                    }
                }

                return response()->json([
                    'message' => 'Parece que há alguns erros nos dados fornecidos.',
                    'errors' => $errorMessages,
                ], 422);
            }

            $preRegistration->update($empresaData);

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
}
