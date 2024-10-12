<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\ApiService;
use App\Services\FilemakerAPIService;

class FilemakerAPIController extends Controller
{
    protected $apiService;

    public function __construct(FilemakerAPIService $apiService)
    {
        $this->apiService = $apiService;
    }

    public function testGroupCoreServices()
    {
        $this->apiService->checkToken('auth/GroupCoreServices');
        return response()->json(['message' => 'GroupCoreServices token check complete.']);
    }

    public function testProduction()
    {
        $this->apiService->checkToken('auth/Production');
        return response()->json(['message' => 'Production token check complete.']);
    }
}

