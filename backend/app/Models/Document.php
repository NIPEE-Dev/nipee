<?php

namespace App\Models;

use App\Enums\Document\DocumentStatusEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use SoftDeletes;

    public $table = 'documents';

    public $casts = [
        'status' => DocumentStatusEnum::class,
        'created_at' => 'datetime:Y-m-d h:i:s'
    ];

    public $fillable = [
        'filename',
        'original_filename',
        'file_extension',
        'filesize',
        'type',
        'status',
    ];

    public function attachable(): MorphTo
    {
        return $this->morphTo()->withTrashed();
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($document) {
            // if ($document->type === 'Protocolo') {
            //     $document->status = DocumentStatusEnum::PENDING_COMPANY_SIGNATURE;
            // }
        });
    }
}
