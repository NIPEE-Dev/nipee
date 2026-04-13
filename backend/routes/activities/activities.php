<?php

use App\Http\Controllers\Api\Activities\ActivitiesController;
use App\Http\Controllers\Api\Activities\ActivityController;
use Illuminate\Support\Facades\Route;

Route::controller(ActivitiesController::class)->prefix('activities')->group(function () {
  Route::post('/', 'store');
  Route::get('/', 'index');
  Route::get('/reports', 'indexReports');
  Route::delete('/{id}', 'destroy');
  Route::post('/{id}', 'update');
  Route::put('/{id}/status', 'updateStatus');
});
