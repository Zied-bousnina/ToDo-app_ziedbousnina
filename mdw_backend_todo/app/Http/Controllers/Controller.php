<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

/**
 * @OA\Info(
 *      title="Your API Documentation",
 *      version="1.0",
 *      description="Documentation for your API",
 *      @OA\Contact(
 *          email="your.email@example.com",
 *          name="Your Name"
 *      )
 * )
 */
class Controller extends BaseController
{

    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
}
