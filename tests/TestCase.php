<?php

namespace GalacticInterloper\Ziglite\Tests;

use Closure;
use GalacticInterloper\Ziglite\Helpers\RoutesManifest;
use GalacticInterloper\Ziglite\Providers\ZigliteServiceProvider;
use Orchestra\Testbench\TestCase as OrchestraTestCase;

class TestCase extends OrchestraTestCase {
    protected function setUp(): void {
        parent::setUp();
    }

    protected function tearDown(): void {
        RoutesManifest::clearRoutes();
        parent::tearDown();
    }

    protected function getPackageProviders($app) {
        return [
            ZigliteServiceProvider::class
        ];
    }

    protected function noop(): Closure {
        return fn () => null;
    }
}
