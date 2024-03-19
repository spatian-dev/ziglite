<?php

namespace GalacticInterloper\Ziglite\Helpers;

use GalacticInterloper\Ziglite\Services\PackageService;
use Illuminate\Support\Str;
use Illuminate\Routing\Router;
use Illuminate\Routing\RouteUrlGenerator;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\URL;
use JsonSerializable;

final class RoutesManifest implements JsonSerializable {
    private const UNFILTERED = 'default';

    protected static array $cache = [];

    private string $base;
    private array $filters;
    private string $filters_hash;
    private array $routes;

    public function __construct(array $filters = [], string $base = null) {
        $base = Str::of($base);
        $this->base = rtrim($base->isEmpty() ? url('/') : $base, '/');

        $this->processFilters($filters);

        if (!array_key_exists($this->filters_hash, self::$cache))
            $this->routes = $this->applyFilters();
    }

    public static function clearRoutes() {
        static::$cache = [];
    }

    public function jsonSerialize(): array {
        return $this->toArray();
    }

    public function toArray(): array {
        $url = App::make('url');
        /** @var URL $url */

        return [
            'base' => $this->base,
            'routes' => $this->routes,
            'defaults' => $url->getDefaultParameters() ?? [],
            //'dont_encode' => (new RouteUrlGenerator(null, null))->dontEncode,
        ];
    }

    public function toJson(int $options = 0): string {
        return json_encode($this->toArray(), JSON_THROW_ON_ERROR | $options);
    }

    public function makeScriptTag(string $nonce = '', string $name = null): string {
        $name = $name ?? App::make(PackageService::class)->name();
        return <<<JS
            <script type="text/javascript" {$nonce}>
                const {$name} = {$this->toJson()};
                if (!Object.hasOwn(window, '{$name}'))
                    window.{$name} = {$name};
            </script>
        JS;
    }

    private function processFilters(array $filters): void {
        $this->filters_hash = (count($filters) > 0) ?
            $this->filters_hash = md5(implode('|', $filters)) :
            $this->filters_hash = self::UNFILTERED;

        array_walk($filters, function (mixed &$pattern, int $i) {
            $pattern = Str::of($pattern);
            $exclude = $pattern->startsWith('!');
            $pattern = (string) ($exclude ? $pattern->substr(1) : $pattern);
            $pattern = compact('pattern', 'exclude');
        });

        $this->filters = $filters;
    }

    private function applyFilters(): array {
        if (!array_key_exists(self::UNFILTERED, self::$cache))
            self::$cache[self::UNFILTERED] = $this->namedRoutes();

        self::$cache[$this->filters_hash] = [];
        foreach (self::$cache[self::UNFILTERED] as $name => $details) {
            $pass = false;

            foreach ($this->filters as ['pattern' => $pattern, 'exclude' => $exclude]) {
                if (!Str::is($pattern, $name))
                    continue;

                $pass = !$exclude;
                if ($exclude)
                    break;
            }

            if (!$pass)
                continue;

            self::$cache[$this->filters_hash][$name] = $details;
        }
        return self::$cache[$this->filters_hash];
    }

    private function namedRoutes(): array {
        $router = App::make('router');
        /** @var Router $router */

        $routes = [];
        foreach ($router->getRoutes()->getRoutesByName() as $name => $route) {
            if ($route->isFallback || Str::of($name)->isEmpty())
                continue;

            $routes[$name] = [
                'uri' => $route->uri,
                //'methods' => $route->methods(),
                //'expects' => $route->parameterNames() ?? [],
                'domain' => $route->domain(),
                'wheres' => $route->wheres,
            ];
        }

        return $routes;
    }
}
