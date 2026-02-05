<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreParcelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'owner_name' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'in:draft,validated,official'],
            'soil_data' => ['nullable', 'array'],
            'geom' => ['nullable', 'string'],
            'soil_m' => ['nullable', 'numeric'],
            'soil_a' => ['nullable', 'numeric'],
            'soil_b' => ['nullable', 'integer', 'min:1', 'max:4'],
            'soil_c' => ['nullable', 'integer', 'min:1', 'max:6'],
            'factor_r' => ['nullable', 'numeric'],
            'factor_ls' => ['nullable', 'numeric'],
            'factor_c_veg' => ['nullable', 'numeric'],
            'factor_p_prac' => ['nullable', 'numeric'],
        ];
    }
}
