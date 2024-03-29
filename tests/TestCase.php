<?php

namespace Spatian\Ziglite\Tests;

use Closure;
use Spatian\Ziglite\Routes\Manifest;
use Spatian\Ziglite\Providers\ZigliteServiceProvider;
use Orchestra\Testbench\TestCase as OrchestraTestCase;

class TestCase extends OrchestraTestCase {
    protected function setUp(): void {
        parent::setUp();
    }

    protected function tearDown(): void {
        Manifest::clearRoutes();
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
