<?php

use Spatian\Ziglite\Generators\JavascriptDataTagGenerator;
use Spatian\Ziglite\Services\PackageService;
use Illuminate\Contracts\Routing\UrlGenerator;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

beforeEach(function () {
    $this->urlGenerator = App::make(UrlGenerator::class);
    $this->defaults = ['foo' => 'bar'];

    Route::get('/', $this->noop())->name('home');
    Route::get('/defaults/{foo}', $this->noop())->name('defaults');
    $this->urlGenerator->defaults($this->defaults);

    Route::getRoutes()->refreshNameLookups();
});

describe("Javascript Data Tag Generator", function () {
    test('Include the given nonce in the generated script tag', function () {
        $nonce = 'pneumonoultramicroscopicsilicovolcanoconiosis';
        $tag = (new JavascriptDataTagGenerator())->make(filters: 'home', nonce: $nonce);

        expect($tag)
            ->toContain("<script type=\"text/javascript\" {$nonce}>");
    });

    test('Makes a script tag with the given variable name', function () {
        $varname = 'ziglite_test';
        $tag = (new JavascriptDataTagGenerator())->make(filters: 'home', name: $varname);

        expect($tag)
            ->toContain("if ((typeof window !== 'undefined') && !Object.hasOwn(window, '{$varname}'))")
            ->toContain("window.{$varname} =");
    });

    test('Generated script tag contain the correct routes manifest', function () {
        $varname = App::make(PackageService::class)->name() . '_data';
        $tag = (new JavascriptDataTagGenerator())->make(filters: 'home');

        $generated = Str::beforeLast(Str::after($tag, "window.{$varname} = '"), "';");

        $expected = json_encode([
            "base" => url('/'),
            "routes" => [
                "home" => [
                    "uri" => "/",
                    "domain" => null,
                    "wheres" => new stdClass(),
                ],
            ],
            "defaults" => $this->defaults,
        ], JSON_THROW_ON_ERROR);

        expect($generated)
            ->toBe($expected);
    });
});
