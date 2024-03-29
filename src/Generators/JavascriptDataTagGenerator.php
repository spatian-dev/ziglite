<?php

namespace Spatian\Ziglite\Generators;

use Spatian\Ziglite\Services\PackageService;
use Spatian\Ziglite\Interfaces\OutputGeneratorInterface;
use Spatian\Ziglite\Routes\Manifest;
use Illuminate\Support\Facades\App;

final class JavascriptDataTagGenerator implements OutputGeneratorInterface {
    public function make(
        array|string $filters = [],
        string $base = null,
        string $nonce = '',
        string $name = null,
    ): string {
        $name = $name ?? App::make(PackageService::class)->name() . '_data';
        $manifest = (new Manifest($filters));
        return <<<HTML
            <script type="text/javascript" {$nonce}>
                if (!Object.hasOwn(window, '{$name}'))
                    window.{$name} = '{$manifest->toJson()}';
            </script>
        HTML;
    }
}
