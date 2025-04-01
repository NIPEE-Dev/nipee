<?php

namespace App\Providers;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Gate;
use Laravel\Telescope\EntryType;
use Laravel\Telescope\IncomingEntry;
use Laravel\Telescope\Telescope;
use Laravel\Telescope\TelescopeApplicationServiceProvider;

class TelescopeServiceProvider extends TelescopeApplicationServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        Telescope::night();

        $this->hideSensitiveRequestDetails();

        Telescope::filterBatch(function (Collection $entries) {
            if ($this->app->environment('local')) {
                return true;
            }

            return $entries->contains(
                fn(IncomingEntry $entry) => $entry->isReportableException() ||
                    $entry->isFailedJob() ||
                    $entry->isFailedRequest() ||
                    $entry->isScheduledTask() ||
                    $entry->isSlowQuery() ||
                    $entry->hasMonitoredTag() ||
                    ($entry->type === EntryType::REQUEST &&
                        ($entry->content['response_status'] ?? 200) === 422)
            );
        });

    }

    /**
     * Prevent sensitive request details from being logged by Telescope.
     */
    protected function hideSensitiveRequestDetails(): void
    {
        if ($this->app->environment('local')) {
            return;
        }

        Telescope::hideRequestParameters(['_token']);

        Telescope::hideRequestHeaders([
            'cookie',
            'x-csrf-token',
            'x-xsrf-token',
        ]);
    }

    /**
     * Register the Telescope gate.
     *
     * This gate determines who can access Telescope in non-local environments.
     */
    protected function gate(): void
    {
        Gate::define('viewTelescope', function ($user) {
            return in_array($user->email, [
                'evertonneri@outlook.com'
            ]);
        });
    }
}
