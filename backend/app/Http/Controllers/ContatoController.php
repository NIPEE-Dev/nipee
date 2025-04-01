<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContatoMail;

class ContatoController extends Controller
{
    public function enviarFormulario(Request $request)
    {
        $dados = $request->validate([
            'nome' => 'required|string|max:255',
            'email' => 'required|email',
            'assunto' => 'required|string|max:255',
            'mensagem' => 'required|string',
        ]);

        //Mail::to(env('MAIL_TO_ADDRESS', 'contato@luizagarcia.com'))->send(new ContatoMail($dados));

        return response()->json([
            'message' => 'Mensagem enviada com sucesso!',
            'success' => true
        ]);
    }
}
