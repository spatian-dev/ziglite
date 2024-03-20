<?php

use GalacticInterloper\Ziglite\Helpers\RoutesManifest;
use GalacticInterloper\Ziglite\Providers\ZigliteServiceProvider;
use GalacticInterloper\Ziglite\Services\PackageService;
use Illuminate\Support\Facades\App;

beforeEach(function () {
    $this->provider = App::make(ZigliteServiceProvider::class);
    $this->package = App::make(PackageService::class);
    $this->blade = App::make('blade.compiler');
});

describe("Ziglite Service Provider", function () {
    test('Registers the default blade directive', function () {
        expect($this->blade->getCustomDirectives())
            ->toHaveKey($this->package->name());
    });

    test('Registers a blade directive with a custom name', function () {
        $custom = 'ziglite_test';
        expect($this->blade->getCustomDirectives())
            ->not->toHaveKey($custom);

        $this->provider->setupBladeDirective($custom);

        expect($this->blade->getCustomDirectives())
            ->toHaveKey($custom);
    });

    test('Directives compiles correctly', function (string $expr) {
        $directive = '@' . $this->package->name();
        $class = RoutesManifest::class;

        expect($this->blade->compileString("{$directive}({$expr})"))
            ->toBe("<?php echo (new \{$class}({$expr}))->makeScriptTag(); ?>");
    })->with([
        '',
        'users.*',
        '["users.*", "regions.*"]',
        '"", "nonce"',
        'nonce: "nonce"',
    ]);
});