<?php

use Symfony\Component\VarDumper\VarDumper;

if (!function_exists('initials')) {
    function initials($name)
    {
        $names = explode(" ", $name);

        if (count($names) === 1) {
            return strtoupper(substr($names[0], 0, 2));
        } elseif (count($names) >= 2) {
            return strtoupper(substr($names[0], 0, 1) . substr($names[1], 0, 1));
        } else {
            return '';
        }
    }
}

if (!function_exists('calculatePercent')) {
    function calculatePercent($quantity, $total)
    {
        return $total === 0
            ? 0
            : ($quantity / $total) * 100;
    }
}

if (!function_exists('calculatePercentIndicator')) {
    function calculatePercentIndicator($current, $original)
    {
        $diff = $current - $original;
        $more_or_less = $diff > 0 ? "more" : "less";
        $diff = abs($diff);
        $percentChange = ($diff / ($original === 0 ? 1 : $original)) * 100;

        return [
            'percent' => $percentChange,
            'more_or_less' => $more_or_less
        ];
    }
}

if (!function_exists('format_percent')) {
    function format_percent($value)
    {
        return number_format($value, 2, '.', '');
    }
}


if (!function_exists('ddApi')) {
    /**
     * O dd normal não funciona quando esta usando XHR com preflight;
     * @return never
     */
    function ddApi(...$vars)
    {
        header('Access-Control-Allow-Origin:' . config('app.url'));
        header('Access-Control-Allow-Credentials: true');

        if (!in_array(PHP_SAPI, ['cli', 'phpdbg'], true) && !headers_sent()) {
            header('HTTP/1.1 500 Internal Server Error');
        }

        foreach ($vars as $v) {
            VarDumper::dump($v);
        }

        exit(1);
    }
}

if (!function_exists('dumpApi')) {
    /**
     * O dd normal não funciona quando esta usando XHR com preflight;
     * @return never
     */
    function dumpApi(...$vars)
    {
        header('Access-Control-Allow-Origin:' . config('app.url'));
        header('Access-Control-Allow-Credentials: true');

        if (!in_array(PHP_SAPI, ['cli', 'phpdbg'], true) && !headers_sent()) {
            header('HTTP/1.1 500 Internal Server Error');
        }

        foreach ($vars as $v) {
            VarDumper::dump($v);
        }
    }
}

if (!function_exists('maskToFloat')) {
    /**
     * Remove a mascara de dinheiro do front
     */
    function maskToFloat($value)
    {
        if (is_numeric($value)) {
            return $value;
        }

        $value = str_replace("R$ ", "", $value);
        $value = str_replace(".", "", $value);
        $value = str_replace(",", ".", $value);

        if (is_numeric($value)) {
            return $value;
        }

        return false;
    }
}

if (!function_exists('getCityByUf')) {
    /**
     * Remove a mascara de dinheiro do front
     */
    function getCityByUf($uf)
    {
        return match (strtolower($uf)) {
            'beja' => 'Beja',
            'braga' => 'Braga',
            'braganca' => 'Bragança',
            'castelo-branco' => 'Castelo Branco',
            'coimbra' => 'Coimbra',
            'evora' => 'Évora',
            'faro' => 'Faro',
            'guarda' => 'Guarda',
            'leiria' => 'Leiria',
            'lisboa' => 'Lisboa',
            'portalegre' => 'Portalegre',
            'porto' => 'Porto',
            'santarem' => 'Santarém',
            'setubal' => 'Setúbal',
            'viana-do-castelo' => 'Viana do Castelo',
            'vila-real' => 'Vila Real',
            'viseu' => 'Viseu',
            'acores' => 'Açores',
            'madeira' => 'Madeira',
            default => null,
        };
    }
}

if (!function_exists('toSql')) {
    function toSql($query)
    {
        return vsprintf(str_replace('?', '%s', $query->toSql()), collect($query->getBindings())->map(function ($binding) {
            return is_numeric($binding) ? $binding : "'{$binding}'";
        })->toArray());
    }
}

if (!function_exists('user')) {
    function user()
    {
        foreach (array_keys(config('auth.guards')) as $guard) {
            if (
                auth()
                ->guard($guard)
                ->check()
            ) {
                return auth($guard)->user();
            }
        }

        return null;
    }
}

if (!function_exists('journeyText')) {
    function journeyText($workingDay): string
    {
        $weekdays = [
            1 => 'Segunda-feira',
            2 => 'Terça-feira',
            3 => 'Quarta-feira',
            4 => 'Quinta-feira',
            5 => 'Sexta-feira',
            6 => 'Sábado',
            7 => 'Domingo',

        ];

        $text = "A Formação em Contexto de Trabalho decorrerá sempre que possível, no regime de {$weekdays[$workingDay->start_weekday]} à {$weekdays[$workingDay->end_weekday]} das {$workingDay->start_hour} às {$workingDay->end_hour}";
        if ($workingDay->day_off_start_weekday) {
            $text .= " e de {$weekdays[$workingDay->day_off_start_weekday]} das {$workingDay->day_off_start_hour} às {$workingDay->day_off_end_hour}";
        }

        $text .= " (com {$workingDay->day_off}) totalizando {$workingDay->working_hours} horas semanais, podendo abranger os fins-de-semana e funcionar em regime de rotatividade, caso seja necessário. Em casos particulares poderá o horário ser prolongado para além das 20h00.";

        return strtoupper($text);
    }
}
