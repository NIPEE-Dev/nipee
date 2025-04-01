<?php


namespace App\Services;


use Illuminate\Http\UploadedFile;
use Tymon\JWTAuth\Facades\JWTAuth;

class FileUploadService
{
    private string $prefixImage = 'document-';

    private string $storage = '/public';

    private string $paste = 'documents';

    public function store(UploadedFile $file): string
    {
        $extension = $file->extension();
        $filename = auth()->user()?->id . "x" . uniqid($this->prefixImage) . '.' . $extension;
        $file->storeAs($this->storage . '/' . $this->paste, $filename);

        return $filename;
    }

    /**
     * @param string $prefixImage
     */
    public function setPrefixImage(string $prefixImage): void
    {
        $this->prefixImage = $prefixImage;
    }

    /**
     * @param string $storage
     */
    public function setStorage(string $storage): void
    {
        $this->storage = $storage;
    }

    /**
     * @param string $paste
     */
    public function setPaste(string $paste): void
    {
        $this->paste = $paste;
    }
}
