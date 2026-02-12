<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreParcelRequest;
use App\Http\Requests\UpdateParcelRequest;
use App\Models\Parcel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ParcelController extends Controller
{
    public function index(): JsonResponse
    {
        $query = Parcel::query()
            ->select([
                'id',
                'owner_name',
                'status',
                'soil_data',
                'created_by',
                'soil_m',
                'soil_a',
                'soil_b',
                'soil_c',
                'factor_r',
                'factor_ls',
                'factor_c_veg',
                'factor_p_prac',
                'computed_k',
                'computed_erosion',
                'erosion_risk_level',
            ]);

        if (auth()->check()) {
            $this->authorize('viewAny', Parcel::class);
        } else {
            $query->where('status', 'official');
        }

        $parcels = $query->latest()->get();

        return response()->json($parcels);
    }

    public function geojson(Request $request): JsonResponse
    {
        if (auth()->check()) {
            $this->authorize('viewAny', Parcel::class);
        }

        $validated = $request->validate([
            'minLat' => ['nullable', 'numeric', 'between:-90,90'],
            'minLng' => ['nullable', 'numeric', 'between:-180,180'],
            'maxLat' => ['nullable', 'numeric', 'between:-90,90'],
            'maxLng' => ['nullable', 'numeric', 'between:-180,180'],
        ]);

        $hasAnyBound = collect(['minLat', 'minLng', 'maxLat', 'maxLng'])
            ->contains(fn (string $key) => array_key_exists($key, $validated));

        $hasAllBounds = collect(['minLat', 'minLng', 'maxLat', 'maxLng'])
            ->every(fn (string $key) => array_key_exists($key, $validated));

        if ($hasAnyBound && ! $hasAllBounds) {
            return response()->json([
                'message' => 'Les paramètres minLat, minLng, maxLat et maxLng doivent être fournis ensemble.',
            ], 422);
        }

        if ($hasAllBounds && ($validated['minLat'] > $validated['maxLat'] || $validated['minLng'] > $validated['maxLng'])) {
            return response()->json([
                'message' => 'Bornes invalides: min doit être inférieur ou égal à max.',
            ], 422);
        }

        $statusFilter = auth()->check() ? null : 'official';
        $params = [];
        $whereClauses = [];

        if ($statusFilter) {
            $whereClauses[] = 'status = ?';
            $params[] = $statusFilter;
        }

        Log::info('Fetching parcels with params', $request->query());

        if ($hasAllBounds) {
            // Normalize geometries to SRID 4326 before intersection to avoid mixed-SRID PostGIS errors.
            $whereClauses[] = 'ST_Intersects(
                ST_Transform(CASE WHEN ST_SRID(geom) = 0 THEN ST_SetSRID(geom, 4326) ELSE geom END, 4326),
                ST_MakeEnvelope(CAST(? AS double precision), CAST(? AS double precision), CAST(? AS double precision), CAST(? AS double precision), 4326)
            )';
            $params[] = $validated['minLng'];
            $params[] = $validated['minLat'];
            $params[] = $validated['maxLng'];
            $params[] = $validated['maxLat'];
        }

        $sql = '
            SELECT
                id,
                owner_name,
                status,
                soil_data,
                created_by,
                soil_m,
                soil_a,
                soil_b,
                soil_c,
                factor_r,
                factor_ls,
                factor_c_veg,
                factor_p_prac,
                computed_k,
                computed_erosion,
                erosion_risk_level,
                ST_AsGeoJSON(
                    ST_Transform(CASE WHEN ST_SRID(geom) = 0 THEN ST_SetSRID(geom, 4326) ELSE geom END, 4326)
                )::json AS geometry
            FROM parcels
        ';

        if (! empty($whereClauses)) {
            $sql .= ' WHERE '.implode(' AND ', $whereClauses);
        }

        Log::info('Executing parcel query', ['sql' => $sql, 'params' => $params]);

        try {
            $rows = DB::select($sql, $params);
        } catch (\Throwable $e) {
            Log::error('GeoJSON query failed', [
                'message' => $e->getMessage(),
                'query' => $sql,
                'params' => $params,
            ]);

            return response()->json([
                'message' => 'Erreur lors du chargement des parcelles.',
            ], 500);
        }

        $features = array_map(function ($row) {
                $properties = [
                    'id' => $row->id,
                    'owner_name' => $row->owner_name,
                    'status' => $row->status,
                    'soil_data' => $row->soil_data,
                    'created_by' => $row->created_by,
                    'soil_m' => $row->soil_m,
                    'soil_a' => $row->soil_a,
                    'soil_b' => $row->soil_b,
                    'soil_c' => $row->soil_c,
                    'factor_r' => $row->factor_r,
                    'factor_ls' => $row->factor_ls,
                    'factor_c_veg' => $row->factor_c_veg,
                    'factor_p_prac' => $row->factor_p_prac,
                    'computed_k' => $row->computed_k,
                    'computed_erosion' => $row->computed_erosion,
                    'erosion_risk_level' => $row->erosion_risk_level,
                ];
    
                return [
                    'type' => 'Feature',
                    'id' => $row->id,
                    'geometry' => $row->geometry,
                    'properties' => $properties,
                ];
        }, $rows);

        return response()->json([
            'type' => 'FeatureCollection',
            'features' => $features,
        ]);
    }
    public function store(StoreParcelRequest $request): JsonResponse
    {
        $this->authorize('create', Parcel::class);

        $data = $request->validated();
        $geom = $data['geom'] ?? null;
        unset($data['geom']);

        $parcel = Parcel::create($data);

        if ($geom) {
            DB::update(
                'UPDATE parcels SET geom = ST_SetSRID(ST_GeomFromGeoJSON(?), 4326) WHERE id = ?',
                [$geom, $parcel->id]
            );
        }

        return response()->json($parcel->refresh(), 201);
    }

    public function show(string $id): JsonResponse
    {
        $parcel = Parcel::findOrFail($id);

        if (auth()->check()) {
            $this->authorize('view', $parcel);
        } elseif ($parcel->status !== 'official') {
            abort(404);
        }

        return response()->json($parcel);
    }

    public function update(UpdateParcelRequest $request, string $id): JsonResponse
    {
        $parcel = Parcel::findOrFail($id);
        $this->authorize('update', $parcel);

        $data = $request->validated();
        $geom = $data['geom'] ?? null;
        unset($data['geom']);

        $parcel->fill($data)->save();

        if ($geom) {
            DB::update(
                'UPDATE parcels SET geom = ST_SetSRID(ST_GeomFromGeoJSON(?), 4326) WHERE id = ?',
                [$geom, $parcel->id]
            );
        }

        return response()->json($parcel->refresh());
    }

    public function destroy(string $id): JsonResponse
    {
        $parcel = Parcel::findOrFail($id);
        $this->authorize('delete', $parcel);
        $parcel->delete();

        return response()->json(['deleted' => true]);
    }

    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $parcel = Parcel::findOrFail($id);
        $this->authorize('update', $parcel);

        $data = $request->validate([
            'status' => ['required', 'in:draft,validated,official'],
        ]);

        $parcel->status = $data['status'];
        $parcel->save();

        return response()->json([
            'id' => $parcel->id,
            'status' => $parcel->status,
        ]);
    }
}
