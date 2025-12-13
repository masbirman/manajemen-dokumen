<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Record;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RecordController extends Controller
{
    public function index(Request $request)
    {
        $query = Record::with(['unit:id,name', 'type:id,name', 'pptk:id,name', 'creator:id,name,username'])
                       ->orderBy('created_at', 'desc');

        // Filters
        if ($request->has('unit_id')) {
            $query->where('unit_id', $request->unit_id);
        }
        if ($request->has('type_id')) {
            $query->where('type_id', $request->type_id);
        }
        if ($request->has('pptk_id')) {
            $query->where('pptk_id', $request->pptk_id);
        }

        // Pagination
        $perPage = $request->input('per_page', 15);
        $records = $query->paginate($perPage);

        return response()->json([
            'data' => $records->items(),
            'meta' => [
                'current_page' => $records->currentPage(),
                'last_page' => $records->lastPage(),
                'per_page' => $records->perPage(),
                'total' => $records->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'unit_id' => 'required|exists:units,id',
            'type_id' => 'required|exists:types,id',
            'pptk_id' => 'required|exists:pptks,id',
            'nilai' => 'required|numeric|min:0',
            'uraian' => 'nullable|string',
            'pdf' => 'nullable|file|mimes:pdf|max:10240',
        ]);

        if ($request->hasFile('pdf')) {
            $validated['pdf_path'] = $request->file('pdf')->store('documents', 'public');
        }

        $validated['created_by'] = $request->user()->id;

        $record = Record::create($validated);

        return response()->json([
            'message' => 'Record berhasil disimpan',
            'data' => $record->load(['unit:id,name', 'type:id,name', 'pptk:id,name']),
        ], 201);
    }

    public function show(Record $record)
    {
        return response()->json([
            'data' => $record->load(['unit:id,name', 'type:id,name', 'pptk:id,name']),
        ]);
    }

    public function update(Request $request, Record $record)
    {
        $validated = $request->validate([
            'unit_id' => 'sometimes|required|exists:units,id',
            'type_id' => 'sometimes|required|exists:types,id',
            'pptk_id' => 'sometimes|required|exists:pptks,id',
            'nilai' => 'sometimes|required|numeric|min:0',
            'uraian' => 'nullable|string',
            'pdf' => 'nullable|file|mimes:pdf|max:10240',
        ]);

        if ($request->hasFile('pdf')) {
            // Delete old file
            if ($record->pdf_path) {
                Storage::disk('public')->delete($record->pdf_path);
            }
            $validated['pdf_path'] = $request->file('pdf')->store('documents', 'public');
        }

        $record->update($validated);

        return response()->json([
            'message' => 'Record berhasil diupdate',
            'data' => $record->load(['unit:id,name', 'type:id,name', 'pptk:id,name']),
        ]);
    }

    public function destroy(Record $record)
    {
        // Delete PDF file
        if ($record->pdf_path) {
            Storage::disk('public')->delete($record->pdf_path);
        }

        $record->delete();

        return response()->json([
            'message' => 'Record berhasil dihapus',
        ]);
    }
}
