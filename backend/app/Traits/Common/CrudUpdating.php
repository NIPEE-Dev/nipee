<?php

namespace App\Traits\Common;


trait CrudUpdating
{
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->isDirty('created_by')) {
                $model->created_by = user()->id;
            }
            if (!$model->isDirty('updated_by')) {
                $model->updated_by = user()->id;
            }
        });

        static::updating(function ($model) {
            if (!$model->isDirty('updated_by')) {
                $model->updated_by = user()->id;
            }
        });
    }
}
