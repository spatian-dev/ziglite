<?php

namespace Spatian\Ziglite\Interfaces;

interface OutputGeneratorInterface {
    public function make(
        array|string $filters = [],
        string $base = null,
        string $nonce = ''
    ): string;
}
