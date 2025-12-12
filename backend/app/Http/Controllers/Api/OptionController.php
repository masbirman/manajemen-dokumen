<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pptk;
use App\Models\Setting;
use App\Models\Type;
use App\Models\Unit;
use Illuminate\Http\Request;

class OptionController extends Controller
{
    public function index()
    {
        return response()->json([
            'units' => Unit::where('is_active', true)->orderBy('name')->get(['id', 'name', 'code']),
            'types' => Type::where('is_active', true)->orderBy('name')->get(['id', 'name', 'code']),
            'pptks' => Pptk::with('unit:id,name')
                          ->where('is_active', true)
                          ->orderBy('name')
                          ->get(['id', 'name', 'nip', 'unit_id']),
        ]);
    }

    public function pptksByUnit(Unit $unit)
    {
        return response()->json(
            $unit->pptks()
                 ->where('is_active', true)
                 ->orderBy('name')
                 ->get(['id', 'name', 'nip'])
        );
    }

    public function petunjuk()
    {
        $defaultContent = '<ul>
            <li>Pilih <strong>Unit</strong> terlebih dahulu</li>
            <li>PPTK akan muncul berdasarkan Unit yang dipilih</li>
            <li>Untuk scan dokumen, buka di perangkat mobile</li>
        </ul>';

        return response()->json([
            'content' => Setting::get('petunjuk_content', $defaultContent),
        ]);
    }
}

