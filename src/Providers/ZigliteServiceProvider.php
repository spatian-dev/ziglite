<?php

namespace GalacticInterloper\Ziglite\Providers;

use GalacticInterloper\Ziglite\Services\PackageService;
use GalacticInterloper\Ziglite\Services\RoutingService;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Foundation\Console\AboutCommand;
use Illuminate\Support\ServiceProvider;
use Illuminate\View\Compilers\BladeCompiler;

final class ZigliteServiceProvider extends ServiceProvider {

    public function __construct(
        Application $app,
        private PackageService $package = new PackageService(),
        private RoutingService $routing = new RoutingService(),
    ) {
        parent::__construct($app);
    }

    protected function publishes(array $paths, $group = null): void {
        $groups = [$this->package->name()];
        if (isset($group))
            $groups[] = $this->package->name() . '-' . $group;
        parent::publishes($paths, $groups);
    }

    public function register(): void {
        $this->bindServices();
        $this->mergeConfigFrom($this->package->configFile(), $this->package->name());
    }

    public function boot(): void {
        if ($this->app->runningInConsole()) {
            $this->registerCommands();
            $this->registerPublishing();
        }

        if ($this->app->resolved('blade.compiler')) {
            $this->routing
                ->registerBladeDirectives($this->app['blade.compiler']);
        } else {
            $this->app->afterResolving(
                'blade.compiler',
                function (BladeCompiler $blade) {
                    $this->routing->registerBladeDirectives($blade);
                }
            );
        }
    }

    private function bindServices(): void {
        $this->app->singleton(RoutingService::class, fn() => $this->routing);
    }

    private function registerCommands(): void {
        AboutCommand::add(
            $this->package->displayName(),
            fn () => ['Version' => $this->package->version()]
        );
    }

    private function registerPublishing(): void {
        $this->publishes([
            $this->package->configFile() => config_path($this->package->name() . '.php'),
            'config'
        ]);
    }
}
