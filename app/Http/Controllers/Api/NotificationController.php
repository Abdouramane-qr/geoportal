<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $notifications = $user->notifications()
            ->latest()
            ->limit(50)
            ->get()
            ->map(function (DatabaseNotification $notification) {
                $data = is_array($notification->data) ? $notification->data : [];

                return [
                    'id' => $notification->id,
                    'title' => (string) ($data['title'] ?? 'Notification'),
                    'message' => (string) ($data['message'] ?? ''),
                    'type' => (string) ($data['type'] ?? 'info'),
                    'entity_type' => (string) ($data['entity_type'] ?? ''),
                    'entity_id' => (string) ($data['entity_id'] ?? ''),
                    'entity_name' => $data['entity_name'] ?? null,
                    'is_read' => $notification->read_at !== null,
                    'created_at' => optional($notification->created_at)->toISOString(),
                ];
            })
            ->values();

        return response()->json([
            'data' => $notifications,
        ]);
    }

    public function markAsRead(Request $request, string $id): JsonResponse
    {
        $notification = $request->user()
            ->notifications()
            ->where('id', $id)
            ->firstOrFail();

        if ($notification->read_at === null) {
            $notification->markAsRead();
        }

        return response()->json([
            'updated' => true,
        ]);
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        $request->user()->unreadNotifications->markAsRead();

        return response()->json([
            'updated' => true,
        ]);
    }
}
