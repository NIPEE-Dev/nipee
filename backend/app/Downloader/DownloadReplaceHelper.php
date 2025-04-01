<?php

namespace App\Downloader;

class DownloadReplaceHelper
{
    public function __construct(private readonly string $key, private readonly string $expectedKey, private mixed &$value, private $callable, private $exact = false)
    {
    }

    public static function from(string $key, string $expectedKey, mixed &$value, $callable)
    {
        return (new static($key, $expectedKey, $value, $callable, false))->replaceValue();
    }

    public static function exact(string $key, string $expectedKey, mixed &$value, $callable)
    {
        return (new static($key, $expectedKey, $value, $callable, true))->replaceValue();
    }

    protected function replaceValue()
    {
        if ($this->shouldReplace($this->key, $this->expectedKey)) {
            $this->value = ($this->callable)();
        }

        return $this->value;
    }

    protected function shouldReplace(string $key, string $expectedKey): bool
    {
        if ($this->exact) {
            return $key === $expectedKey;
        }

        return str_contains($key, $expectedKey);
    }
}