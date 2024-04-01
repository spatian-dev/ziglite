<?php

namespace Spatian\Ziglite\Interfaces;

interface OutputGeneratorInterface {
    /**
     * @param array<string>|string $filters pattern or list of patterns for filtering
     * @param string $base custom origin
     * @param string $nonce A CSP nonce.
     *
     * @return string Output
     */
    public function make(
        array|string $filters = [],
        string $base = null,
        string $nonce = ''
    ): string;
}
