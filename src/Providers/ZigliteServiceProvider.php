<?php

namespace Spatian\Ziglite\Providers;

use Spatian\Ziglite\Generators\JavascriptDataTagGenerator;
use Spatian\Ziglite\Interfaces\OutputGeneratorInterface;
use Spatian\Ziglite\Services\PackageService;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Foundation\Console\AboutCommand;
use Illuminate\Support\ServiceProvider;
use Illuminate\View\Compilers\BladeCompiler;

final class ZigliteServiceProvider extends ServiceProvider {

    public function __construct(
        Application $app,
        private PackageService $package = new PackageService(),
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
        $this->mergeConfigFrom($this->package->configFile(), $this->package->name());
        $this->bindServices();
    }

    public function boot(): void {
        if ($this->app->runningInConsole()) {
            $this->registerCommands();
            $this->registerPublishing();
        }

        if ($this->package->config('blade.directives.register_default', true))
            $this->setupBladeDirective();
    }

    public function setupBladeDirective(
        string $name = null,
        OutputGeneratorInterface $generator = null
    ): void {
        if ($this->app->resolved('blade.compiler')) {
            $this->registerBladeDirective($this->app['blade.compiler'], $name, $generator);
        } else {
            $this->app->afterResolving(
                'blade.compiler',
                fn (BladeCompiler $blade) => $this->registerBladeDirective($blade, $name, $generator)
            );
        }
    }

    private function bindServices(): void {
        $this->app->singleton(PackageService::class, fn () => $this->package);
    }

    private function registerCommands(): void {
        AboutCommand::add(
            $this->package->displayName(),
            fn () => [
                'Version' => $this->package->version(),
                'Webpage' => $this->package->website(),
            ],
        );
    }

    private function registerPublishing(): void {
        $this->publishes([
            $this->package->configFile() => config_path($this->package->name() . '.php'),
            'config'
        ]);
    }

    private function registerBladeDirective(
        BladeCompiler $blade,
        string $directive = null,
        OutputGeneratorInterface $generator = null,
    ): void {
        $directive = $directive ?? $this->package->name();
        $class = is_null($generator) ? JavascriptDataTagGenerator::class : $generator::class;
        $blade->directive(
            $directive,
            function (string $expr = '') use ($class) {
                return "<?php echo (new \\{$class}())->make({$expr}); ?>";
            }
        );
    }
}
