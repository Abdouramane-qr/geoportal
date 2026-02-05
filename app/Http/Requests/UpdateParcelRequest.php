<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateParcelRequest extends FormRequest
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
            'owner_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'status' => ['sometimes', 'nullable', 'in:draft,validated,official'],
            'soil_data' => ['sometimes', 'nullable', 'array'],
            'geom' => ['sometimes', 'nullable', 'string'],
            'soil_m' => ['sometimes', 'nullable', 'numeric'],
            'soil_a' => ['sometimes', 'nullable', 'numeric'],
            'soil_b' => ['sometimes', 'nullable', 'integer', 'min:1', 'max:4'],
            'soil_c' => ['sometimes', 'nullable', 'integer', 'min:1', 'max:6'],
            'factor_r' => ['sometimes', 'nullable', 'numeric'],
            'factor_ls' => ['sometimes', 'nullable', 'numeric'],
            'factor_c_veg' => ['sometimes', 'nullable', 'numeric'],
            'factor_p_prac' => ['sometimes', 'nullable', 'numeric'],
        ];
    }
}
