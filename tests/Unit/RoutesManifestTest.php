<?php

use GalacticInterloper\Ziglite\Helpers\RoutesManifest;
use GalacticInterloper\Ziglite\Tests\Fixtures\Controllers\NoopController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

beforeEach(function () {
    $this->defaults = ['foo' => 'bar'];

    Route::get('/', $this->noop())->name('home');
    Route::get('/{file}.md', $this->noop())->name('markdown');

    Route::domain('{region}.domain.test')
        ->name('regions.')
        ->where(['region' => '[a-zA-Z0-9]+'])
        ->group(function () {
            Route::get('/', $this->noop())->name('index');
            Route::get('/map', $this->noop())->name('map');
        });

    Route::name('users.')
        ->prefix('users')
        ->group(function () {
            Route::get('/', $this->noop())->name('index');

            Route::get('/create', $this->noop())->name('create');
            Route::post('/store', $this->noop())->name('store');

            Route::get('/edit/{user}', $this->noop())->name('edit');
            Route::put('/update/{user}', $this->noop())->name('update');

            Route::delete('/delete/{user}', $this->noop())->name('delete');

            Route::resource('addresses', NoopController::class);
        });

    Route::get('/posts', $this->noop())->name('posts');
    Route::name('posts.')
        ->prefix('posts')
        ->group(function () {
            Route::get('/{post}', $this->noop())->name('show');

            Route::name('comments.')
                ->prefix('{post}/comments')
                ->group(function () {
                    Route::get('/', $this->noop())->name('index');
                    Route::get('/import', $this->noop())->name('import');
                    Route::get('/{comment}', $this->noop())->name('show');
                });

            Route::name('archives.')
                ->prefix('archives')
                ->group(function () {
                    Route::get('/purge', $this->noop())->name('purge');
                    Route::get('/{post}', $this->noop())->name('show');
                    Route::get('/restore/{post?}', $this->noop())->name('restore');
                });
        });

    Route::get('/defaults/{foo}', $this->noop())->name('defaults');
    url()->defaults($this->defaults);

    Route::getRoutes()->refreshNameLookups();
});

describe("Routes Manifest Generator", function () {
    test('Generates a manifest as an array', function () {
        $manifest = new RoutesManifest();
        expect($manifest->toArray())
            ->toMatchArray([
                'base' => url('/'),
                'routes' => new stdClass(),
                'defaults' => $this->defaults,
            ]);
    });

    test('Generates a manifest as a JSON string', function () {
        $manifest = new RoutesManifest();
        expect($manifest->toJson())
            ->toBe(json_encode([
                'base' => url('/'),
                'routes' => new stdClass(),
                'defaults' => $this->defaults,
            ], JSON_THROW_ON_ERROR));
    });

    test('Serializes to JSON in a response', function () {
        Route::get('/serialize', fn () => new RoutesManifest('home'))
            ->name('serialize');
        Route::getRoutes()->refreshNameLookups();

        $response = $this->get(route('serialize'));
        $response->assertSuccessful();
        expect($response->getContent())->toBe((new RoutesManifest('home'))->toJson());
    });

    test('Uses the correct base when provided', function () {
        $base = 'https://domain.test';
        $manifest = new RoutesManifest(base: $base);
        expect($manifest->toArray())
            ->toMatchArray([
                'base' => $base,
            ]);
    });

    test('Uses the correct base when none is provided', function () {
        Route::domain('{sub}.domain.test')
            ->get('/subdomain', fn () => new RoutesManifest('home'))
            ->name('subdomain');
        Route::getRoutes()->refreshNameLookups();

        $this->get(route('subdomain', ['sub' => 'sub']))
            ->assertJson([
                "base" => "http://sub.domain.test"
            ]);
    });

    test('Includes no routes if no filters are provided', function () {
        $manifest = new RoutesManifest();
        expect($manifest->toArray())
            ->toMatchArray([
                'routes' => new stdClass(),
            ]);
    });

    test('Includes named routes only', function () {
        Route::get('/unnamed', $this->noop());
        Route::getRoutes()->refreshNameLookups();

        $manifest = new RoutesManifest('home');
        expect($manifest->toArray())
            ->toMatchArray([
                'routes' => [
                    "home" => [
                        "uri" => "/",
                        "domain" => null,
                        "wheres" => new stdClass(),
                    ],
                ],
            ]);
    });

    test('Correctly applies inclusion filters', function () {
        $manifest = new RoutesManifest([
            'home',
            'regions.*',
            'users*index',
            'users.*.create',
            'users.update',
            'posts',
            'posts.archives*',
            'posts.comments.i*',
        ]);

        $expected = [
            "routes" => [
                "home" => [
                    "uri" => "/",
                    "domain" => null,
                    "wheres" => new stdClass(),
                ],
                "regions.index" => [
                    "uri" => "/",
                    "domain" => "{region}.domain.test",
                    "wheres" => ['region' => '[a-zA-Z0-9]+'],
                ],
                "regions.map" => [
                    "uri" => "map",
                    "domain" => "{region}.domain.test",
                    "wheres" => ['region' => '[a-zA-Z0-9]+'],
                ],
                "users.index" => [
                    "uri" => "users",
                    "domain" => null,
                    "wheres" => new stdClass(),
                ],
                "users.update" => [
                    "uri" => "users/update/{user}",
                    "domain" => null,
                    "wheres" => new stdClass(),
                ],
                "users.addresses.index" => [
                    "uri" => "users/addresses",
                    "domain" => null,
                    "wheres" => new stdClass(),
                ],
                "users.addresses.create" => [
                    "uri" => "users/addresses/create",
                    "domain" => null,
                    "wheres" => new stdClass(),
                ],
                "posts" => [
                    "uri" => "posts",
                    "domain" => null,
                    "wheres" => new stdClass(),
                ],
                "posts.comments.index" => [
                    "uri" => "posts/{post}/comments",
                    "domain" => null,
                    "wheres" => new stdClass(),
                ],
                "posts.comments.import" => [
                    "uri" => "posts/{post}/comments/import",
                    "domain" => null,
                    "wheres" => new stdClass(),
                ],
                "posts.archives.purge" => [
                    "uri" => "posts/archives/purge",
                    "domain" => null,
                    "wheres" => new stdClass(),
                ],
                "posts.archives.show" => [
                    "uri" => "posts/archives/{post}",
                    "domain" => null,
                    "wheres" => new stdClass(),
                ],
                "posts.archives.restore" => [
                    "uri" => "posts/archives/restore/{post?}",
                    "domain" => null,
                    "wheres" => new stdClass(),
                ],
            ],
        ];

        expect($manifest->toArray())
            ->toMatchArray($expected);
    });

    test('Correctly applies exclusion filters', function () {
        $manifest = new RoutesManifest([
            'home',
            '!h*me',
            'regions.*',
            '!regions.map',

            'users.*',
            '!users.addresses.*',

            'posts*show',
            '!posts.show',

            'posts.comments.index',
            '!posts.comments.i*',
        ]);

        $expected = [
            "routes" => [
                "regions.index" => [
                    "uri" => "/",
                    "domain" => "{region}.domain.test",
                    "wheres" => [
                        "region" => "[a-zA-Z0-9]+",
                    ],
                ],
                "users.index" => [
                    "uri" => "users",
                    "domain" => null,
                    "wheres" => new stdClass(),
                ],
                "users.create" => [
                    "uri" => "users/create",
                    "domain" => null,
                    "wheres" => new stdClass(),
                ],
                "users.store" => [
                    "uri" => "users/store",
                    "domain" => null,
                    "wheres" => new stdClass(),
                ],
                "users.edit" => [
                    "uri" => "users/edit/{user}",
                    "domain" => null,
                    "wheres" => new stdClass(),
                ],
                "users.update" => [
                    "uri" => "users/update/{user}",
                    "domain" => null,
                    "wheres" => new stdClass(),
                ],
                "users.delete" => [
                    "uri" => "users/delete/{user}",
                    "domain" => null,
                    "wheres" => new stdClass(),
                ],
                "posts.comments.show" => [
                    "uri" => "posts/{post}/comments/{comment}",
                    "domain" => null,
                    "wheres" => new stdClass(),
                ],
                "posts.archives.show" => [
                    "uri" => "posts/archives/{post}",
                    "domain" => null,
                    "wheres" => new stdClass(),
                ],
            ],
        ];

        expect($manifest->toArray())
            ->toMatchArray($expected);
    });

    test('Caches unfiltered routes', function () {
        $manifest = (new RoutesManifest('users.*'))->toArray();

        Route::get('/new', $this->noop())->name('new');
        Route::getRoutes()->refreshNameLookups();

        expect((new RoutesManifest('users.*'))->toArray())
            ->toMatchArray($manifest);
    });

    test('Caches filtered routes', function () {
        Route::get('/new/first', $this->noop())->name('new.first');
        Route::getRoutes()->refreshNameLookups();

        $filters = ['new.*'];
        $manifest = (new RoutesManifest($filters))->toArray();

        Route::get('/new/second', $this->noop())->name('new.second');
        Route::getRoutes()->refreshNameLookups();

        expect((new RoutesManifest($filters))->toArray())
            ->toMatchArray($manifest);
    });

    test('Sorts fallback routes last', function () {
        Route::fallback($this->noop())->name('fallback');
        Route::get('/settings', $this->noop())->name('settings');

        Route::getRoutes()->refreshNameLookups();

        $manifest = new RoutesManifest([
            'home',
            'fallback',
            'settings',
        ]);

        $expected = [
            "routes" => [
                "home" => [
                    "uri" => "/",
                    "domain" => null,
                    "wheres" => new stdClass(),
                ],
                "settings" => [
                    "uri" => "settings",
                    "domain" => null,
                    "wheres" => new stdClass(),
                ],
                "fallback" => [
                    "uri" => "{fallbackPlaceholder}",
                    "domain" => null,
                    "wheres" => ["fallbackPlaceholder" => ".*"],
                ],
            ],
        ];

        expect($manifest->toArray())
            ->toMatchArray($expected);
    });

    test('Include the given nonce in the generated script tag', function () {
        $nonce = 'pneumonoultramicroscopicsilicovolcanoconiosis';
        $tag = (new RoutesManifest('home', $nonce))->makeScriptTag();

        expect($tag)
            ->toContain("<script type=\"text/javascript\" {$nonce}>");
    });

    test('Makes a script tag with the given variable name', function () {
        $varname = 'ziglite_test';
        $tag = (new RoutesManifest('home'))->makeScriptTag($varname);

        expect($tag)
            ->toContain("if (!Object.hasOwn(window, '{$varname}'))")
            ->toContain("window.{$varname} =");
    });

    test('Generated script tag contain the correct routes manifest', function () {
        $varname = 'ziglite';
        $tag = (new RoutesManifest('home'))->makeScriptTag($varname);

        $generated = Str::beforeLast(Str::after($tag, "window.{$varname} = '"), "';\n");

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
