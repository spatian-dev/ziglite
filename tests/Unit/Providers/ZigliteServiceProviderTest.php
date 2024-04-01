<?php

use Spatian\Ziglite\Generators\JavascriptDataTagGenerator;
use Spatian\Ziglite\Providers\ZigliteServiceProvider;
use Spatian\Ziglite\Services\PackageService;
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

        $this->package->setupBladeDirective($custom);

        expect($this->blade->getCustomDirectives())
            ->toHaveKey($custom);
    });

    test('Directives compiles correctly', function (string $expr) {
        $directive = '@' . $this->package->name();
        $class = JavascriptDataTagGenerator::class;

        expect($this->blade->compileString("{$directive}({$expr})"))
            ->toBe("<?php echo (new \\{$class}())->make({$expr}); ?>");
    })->with([
        '',
        'users.*',
        '["users.*", "regions.*"]',
        '"", "nonce"',
        'nonce: "nonce"',
    ]);
});
