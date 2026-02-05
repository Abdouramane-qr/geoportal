<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreParcelRequest;
use App\Http\Requests\UpdateParcelRequest;
use App\Models\Parcel;
use Illuminate\Http\JsonResponse;
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

        public function geojson(\Illuminate\Http\Request $request): JsonResponse
        {
            if (auth()->check()) {
                $this->authorize('viewAny', Parcel::class);
            }
    
            $statusFilter = auth()->check() ? null : 'official';
            $params = [];
            $whereClauses = [];
    
            if ($statusFilter) {
                $whereClauses[] = "status = ?";
                $params[] = $statusFilter;
            }
    
            $minLat = $request->query('minLat');
            $minLng = $request->query('minLng');
            $maxLat = $request->query('maxLat');
            $maxLng = $request->query('maxLng');
    
                    Log::info('Fetching parcels with params:', $request->query());
            
                    if ($minLat !== null && $minLng !== null && $maxLat !== null && $maxLng !== null) {
                        $whereClauses[] = "ST_Intersects(geom, ST_MakeEnvelope(?, ?, ?, ?, 4326))";
                        $params[] = $minLng;
                        $params[] = $minLat;
                        $params[] = $maxLng;
                        $params[] = $maxLat;
                    }
            
                    $sql = "
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
                            ST_AsGeoJSON(geom)::json AS geometry
                        FROM parcels
                    ";
            
                    if (!empty($whereClauses)) {
                        $sql .= " WHERE " . implode(" AND ", $whereClauses);
                    }
            
                    Log::info('Executing parcel query:', ['sql' => $sql, 'params' => $params]);
            
                    $rows = DB::select($sql, $params);    
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
}
