<?php



namespace GalacticInterloper\Ziglite\Services;

use GalacticInterloper\Ziglite\Helpers\RoutesManifest;
use Illuminate\View\Compilers\BladeCompiler;

final class RoutingService {
    public function registerBladeDirectives(BladeCompiler $blade) {
        $service = self::class;
        $blade->directive('jroutes', function ($filters) use ($service) {
            return <<<PHP
                <?php echo app('$service')->manifest({$filters})->makeScriptTag(); ?>
            PHP;
        });
    }

    public function manifest(array $filters = []): RoutesManifest {
        return new RoutesManifest($filters);
    }
}
