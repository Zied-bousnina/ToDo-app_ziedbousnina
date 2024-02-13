<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateTaskRequest;
use App\Mail\NewTask;
use App\Mail\updateTaskMail;
use App\Mail\WelcomeMail;
use App\Models\Task;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
class TaskController extends Controller
{
    //
    public function index()
    {
        return response()->json([
            'message' => 'Hello World'
        ]);
    }

    /**
 * Create a new task.
 *
 * @OA\Post(
 *      path="/api/task",
 *      operationId="createTask",
 *      tags={"Task"},
 *      summary="Create a new task",
 *      description="Create a new task with the provided details.",
 *      security={{"bearerAuth":{}}},
 *      @OA\RequestBody(
 *          required=true,
 *          @OA\JsonContent(
 *              required={"title", "description", "due_date", "remind_at"},
 *              @OA\Property(property="title", type="string", description="Task title"),
 *              @OA\Property(property="description", type="string", description="Task description"),
 *              @OA\Property(property="due_date", type="string", format="date-time", description="Due date of the task (YYYY-MM-DD HH:mm:ss)"),
 *              @OA\Property(property="remind_at", type="string", format="date-time", description="Remind date of the task (YYYY-MM-DD HH:mm:ss)"),
 *              @OA\Property(property="status", type="string", description="Task status, default is 'en attente'"),
 *          ),
 *      ),
 *      @OA\Response(
 *          response=200,
 *          description="Task created successfully",
 *          @OA\JsonContent(
 *              @OA\Property(property="success", type="boolean", example=true),
 *              @OA\Property(property="message", type="string", example="Task created successfully"),
 *
 *          ),
 *      ),
 *      @OA\Response(
 *          response=401,
 *          description="Unauthenticated",
 *          @OA\JsonContent(
 *              @OA\Property(property="success", type="boolean", example=false),
 *              @OA\Property(property="message", type="string", example="Unauthenticated"),
 *          ),
 *      ),
 *      @OA\Response(
 *          response=422,
 *          description="Validation error",
 *          @OA\JsonContent(
 *              @OA\Property(property="success", type="boolean", example=false),
 *              @OA\Property(property="message", type="string", example="The given data was invalid."),
 *              @OA\Property(property="errors", type="object", example={"title": {"The title field is required."}}),
 *          ),
 *      ),
 *      @OA\Response(
 *          response=500,
 *          description="Server error",
 *          @OA\JsonContent(
 *              @OA\Property(property="success", type="boolean", example=false),
 *              @OA\Property(property="message", type="string", example="Error creating task"),
 *              @OA\Property(property="error", type="string", example="Internal Server Error"),
 *          ),
 *      ),
 * )
 */
    public function store(CreateTaskRequest $request)
    {
        try {

            $task = new Task();
            $task->title = $request->title;
            $task->description = $request->description;
            $task->due_date = Carbon::parse($request->due_date)->format('Y-m-d H:i:s');
            $task->remind_at = Carbon::parse($request->remind_at)->format('Y-m-d H:i:s');
            $task->status = $request->input('status', 'en attente');
            $task->user_id = auth()->user()->id;
            $task->save();

            try {
                Mail::to($request->user()->email)->send(new NewTask());
            } catch (\Throwable $th) {
                Log::error('Error sending email', ['user_id' => auth()->user()->id, 'error_message' => $th->getMessage()]);
            }

            Log::info('Task created successfully', ['user_id' => auth()->user()->id, 'task_id' => $task->id]);
            return response()->json([
                'success' => true,
                'message' => 'Task created successfully',
                'data' => $task,
            ]);
        } catch (\Exception $e) {
            Log::error('Error creating task', ['user_id' => auth()->user()->id, 'error_message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Error creating task',
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
 * Delete a task by ID.
 *
 * @OA\Delete(
 *      path="/api/task/{id}",
 *      operationId="deleteTask",
 *      tags={"Task"},
 *      summary="Delete a task",
 *      description="Delete a task by its ID.",
 *      security={{"bearerAuth":{}}},
 *      @OA\Parameter(
 *          name="id",
 *          in="path",
 *          required=true,
 *          description="ID of the task to delete",
 *          @OA\Schema(type="integer", format="int64"),
 *      ),
 *      @OA\Response(
 *          response=200,
 *          description="Task deleted successfully",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="Task deleted successfully"),
 *          ),
 *      ),
 *      @OA\Response(
 *          response=401,
 *          description="Unauthenticated",
 *          @OA\JsonContent(
 *              @OA\Property(property="success", type="boolean", example=false),
 *              @OA\Property(property="message", type="string", example="Unauthenticated"),
 *          ),
 *      ),
 *      @OA\Response(
 *          response=404,
 *          description="Task not found",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="Task not found"),
 *          ),
 *      ),
 *      @OA\Response(
 *          response=500,
 *          description="Server error",
 *          @OA\JsonContent(
 *              @OA\Property(property="success", type="boolean", example=false),
 *              @OA\Property(property="message", type="string", example="Error deleting task"),
 *              @OA\Property(property="error", type="string", example="Internal Server Error"),
 *          ),
 *      ),
 * )
 */
    public function delete($id)
    {
        try {
            $task = Task::find($id);

            if (!$task) {
                return response()->json([
                    'message' => 'Task not found'
                ], 404);
            }


            Cache::forget('task_' . $id);

            $task->delete();
            Log::info('Task deleted successfully', ['user_id' => auth()->user()->id, 'task_id' => $id]);

            return response()->json([
                'message' => 'Task deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting task', ['user_id' => auth()->user()->id, 'error_message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Error deleting task',
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
 * Update a task by ID.
 *
 * @OA\Patch(
 *      path="/api/task/{id}",
 *      operationId="updateTask",
 *      tags={"Task"},
 *      summary="Update a task",
 *      description="Update a task by its ID with the provided details.",
 *      security={{"bearerAuth":{}}},
 *      @OA\Parameter(
 *          name="id",
 *          in="path",
 *          required=true,
 *          description="ID of the task to update",
 *          @OA\Schema(type="integer", format="int64"),
 *      ),
 *      @OA\RequestBody(
 *          required=false,
 *          @OA\JsonContent(
 *              @OA\Property(property="title", type="string", description="Task title"),
 *              @OA\Property(property="description", type="string", description="Task description"),
 *              @OA\Property(property="status", type="string", description="Task status"),
 *              @OA\Property(property="user_id", type="integer", description="User ID associated with the task"),
 *              @OA\Property(property="completed_at", type="string", format="date-time", description="Completion date of the task (YYYY-MM-DD HH:mm:ss)"),
 *              @OA\Property(property="due_date", type="string", format="date-time", description="Due date of the task (YYYY-MM-DD HH:mm:ss)"),
 *          ),
 *      ),
 *      @OA\Response(
 *          response=200,
 *          description="Task updated successfully",
 *          @OA\JsonContent(
 *
 *              @OA\Property(property="message", type="string", example="Task updated successfully"),
 *
 *          ),
 *      ),
 *      @OA\Response(
 *          response=401,
 *          description="Unauthenticated",
 *          @OA\JsonContent(
 *              @OA\Property(property="success", type="boolean", example=false),
 *              @OA\Property(property="message", type="string", example="Unauthenticated"),
 *          ),
 *      ),
 *      @OA\Response(
 *          response=404,
 *          description="Task not found",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="Task not found"),
 *          ),
 *      ),
 *      @OA\Response(
 *          response=500,
 *          description="Server error",
 *          @OA\JsonContent(
 *              @OA\Property(property="success", type="boolean", example=false),
 *              @OA\Property(property="message", type="string", example="Error updating task"),
 *              @OA\Property(property="error", type="string", example="Internal Server Error"),
 *          ),
 *      ),
 * )
 */
    public function update(Request $request, $id)
    {
        try {
            $task = Cache::remember('task_' . $id, now()->addMinutes(30), function () use ($id) {
                return Task::find($id);
            });

            if (!$task) {
                return response()->json([
                    'message' => 'Task not found'
                ], 404);
            }

            // Update task properties if they exist in the request
            $task->title = $request->input('title', $task->title);
            $task->description = $request->input('description', $task->description);
            $task->status = $request->input('status', $task->status);
            $task->user_id = $request->input('user_id', $task->user_id);
            $task->completed_at = $request->input('completed_at', $task->completed_at);
            $dueDate = $request->input('due_date');
            if ($dueDate) {
                $task->due_date = Carbon::parse($dueDate)->format('Y-m-d H:i:s');
            }


            $task->save();
            try {
                Mail::to($request->user()->email)->send(new updateTaskMail(
                    $request->user(),
                    $task
                ));
            } catch (\Throwable $th) {
                Log::error('Error sending email', ['user_id' => auth()->user()->id, 'error_message' => $th->getMessage()]);
            }


            Log::info('Task updated successfully', ['user_id' => auth()->user()->id, 'task_id' => $task->id]);

            Cache::forget('task_' . $id);

            return response()->json([
                'task' => $task,
                'message' => 'Task updated successfully',
                'user' => $request->user(),
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating task', ['user_id' => auth()->user()->id, 'error_message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Error updating task',
                'error' => $e->getMessage(),
            ]);
        }
    }



/**
 * @OA\Get(
 *      path="/api/task-statistics",
 *      operationId="getTaskStatistics",
 *      tags={"Task"},
 *      summary="Get statistics for user tasks",
 *      description="Returns various statistics for tasks belonging to the authenticated user.",
 *      @OA\Response(
 *          response=200,
 *          description="Successful operation",
 *          @OA\JsonContent(
 *              @OA\Property(property="statistics", type="object",
 *                  @OA\Property(property="en_attente", type="integer", description="Count of tasks with status 'en attente'"),
 *                  @OA\Property(property="open", type="integer", description="Count of tasks with status 'open'"),
 *                  @OA\Property(property="in_progress", type="integer", description="Count of tasks with status 'in progress'"),
 *                  @OA\Property(property="accepted", type="integer", description="Count of tasks with status 'Accepted'"),
 *                  @OA\Property(property="solved", type="integer", description="Count of tasks with status 'solved'"),
 *                  @OA\Property(property="on_hold", type="integer", description="Count of tasks with status 'on hold'"),
 *                  @OA\Property(property="overdue", type="integer", description="Count of tasks that are overdue"),
 *                  @OA\Property(property="to_do", type="integer", description="Alias for 'en_attente'"),
 *                  @OA\Property(property="open_tasks", type="integer", description="Alias for 'open'"),
 *                  @OA\Property(property="due_today", type="integer", description="Count of tasks due today"),
 *              ),
 *          ),
 *      ),
 *      @OA\Response(
 *          response=401,
 *          description="Unauthenticated",
 *      ),
 *      @OA\Response(
 *          response=403,
 *          description="Forbidden",
 *      ),
 * )
 */

    public function getTaskStatistics( Request $request )
    {
        $user_id =auth()->user()->id; // Get the ID of the authenticated user

        $statistics = [
            'en_attente' => Task::where('user_id', $user_id)->where('status', 'en attente')->count(),
            'open' => Task::where('user_id', $user_id)->where('status', 'open')->count(),
            'in_progress' => Task::where('user_id', $user_id)->where('status', 'in progress')->count(),
            'accepted' => Task::where('user_id', $user_id)->where('status', 'Accepted')->count(),
            'solved' => Task::where('user_id', $user_id)->where('status', 'solved')->count(),
            'on_hold' => Task::where('user_id', $user_id)->where('status', 'on hold')->count(),
            'overdue' => Task::where('user_id', $user_id)->where('due_date', '<', now())->count(),
            'to_do' => Task::where('user_id', $user_id)->where('status', 'en attente')->count(),
            'open_tasks' => Task::where('user_id', $user_id)->where('status', 'open')->count(),
            'due_today' => Task::where('user_id', $user_id)->whereDate('due_date', now())->count(),
        ];

        return response()->json(['statistics' => $statistics]);
    }

/**
 * Retrieve tasks with optional sorting.
 *
 * @OA\Get(
 *      path="/api/readWithSortBy",
 *      operationId="readTasksWithSortBy",
 *      tags={"Task"},
 *      summary="Retrieve tasks with optional sorting",
 *      description="Retrieve tasks for the authenticated user with optional sorting based on specified parameters.",
 *      security={{"bearerAuth":{}}},
 *      @OA\Parameter(
 *          name="sort_by",
 *          in="query",
 *          description="Field to sort by (e.g., 'title')",
 *          @OA\Schema(type="string", default="title"),
 *      ),
 *      @OA\Parameter(
 *          name="sort_order",
 *          in="query",
 *          description="Sort order ('asc' or 'desc')",
 *          @OA\Schema(type="string", default="asc"),
 *      ),
 *      @OA\Response(
 *          response=200,
 *          description="Tasks retrieved successfully",
 *          @OA\JsonContent(
 *
 *          ),
 *      ),
 *      @OA\Response(
 *          response=401,
 *          description="Unauthenticated",
 *          @OA\JsonContent(
 *              @OA\Property(property="success", type="boolean", example=false),
 *              @OA\Property(property="message", type="string", example="Unauthenticated"),
 *          ),
 *      ),
 *      @OA\Response(
 *          response=500,
 *          description="Server error",
 *          @OA\JsonContent(
 *              @OA\Property(property="success", type="boolean", example=false),
 *              @OA\Property(property="message", type="string", example="Error retrieving tasks"),
 *              @OA\Property(property="error", type="string", example="Internal Server Error"),
 *          ),
 *      ),
 * )
 */
    public function readWithSortBy(Request $request)
    {
        $user_id = auth()->id(); // Get the ID of the authenticated user
        $sortBy = $request->input('sort_by', 'title'); // Default to sorting by name if not specified
        $sortOrder = $request->input('sort_order', 'asc'); // Default to ascending order if not specified

        $tasks = Task::where('user_id', $user_id)->orderBy($sortBy, $sortOrder)->get();

        return response()->json(['tasks' => $tasks]);
    }


/**
 * Retrieve a specific task by ID.
 *
 * @OA\Get(
 *      path="/api/tasks/{id}",
 *      operationId="getTaskById",
 *      tags={"Task"},
 *      summary="Retrieve a specific task",
 *      description="Retrieve a specific task by ID.",
 *      security={{"bearerAuth":{}}},
 *      @OA\Parameter(
 *          name="id",
 *          in="path",
 *          description="ID of the task to retrieve",
 *          required=true,
 *          @OA\Schema(type="integer"),
 *      ),
 *      @OA\Response(
 *          response=200,
 *          description="Task retrieved successfully",
 *          @OA\JsonContent(
 *
 *          ),
 *      ),
 *      @OA\Response(
 *          response=404,
 *          description="Task not found",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="Task not found"),
 *          ),
 *      ),
 *      @OA\Response(
 *          response=500,
 *          description="Server error",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="Error fetching task"),
 *              @OA\Property(property="error", type="string", example="Internal Server Error"),
 *          ),
 *      ),
 * )
 */
    public function show($id)
    {
        try {

            $task = Cache::remember('task_' . $id, now()->addMinutes(30), function () use ($id) {
                return Task::find($id);
            });

            if (!$task) {
                return response()->json([
                    'message' => 'Task not found'
                ], 404);
            }

            Log::info('Task fetched successfully', ['user_id' => auth()->user()->id, 'task_id' => $task->id]);

            return response()->json([
                'task' => $task
            ]);
        } catch (\Exception $e) {

            Log::error('Error fetching task', ['user_id' => auth()->user()->id, 'error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Error fetching task',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    // public function update(Request $request, $id)
    // {
    //     $task = Task::find($id);

    //     if (!$task) {
    //         return response()->json([
    //             'message' => 'Task not found'
    //         ], 404);
    //     }

    //     $task->update($request->all());

    //     return response()->json([
    //         'task' => $task,
    //         'message' => 'Task updated successfully'
    //     ]);
    // }



    // --------------------------------------------
    /**
 * Retrieve tasks for the authenticated user.
 *
 * @OA\Get(
 *      path="/api/read",
 *      operationId="readTasks",
 *      tags={"Task"},
 *      summary="Retrieve tasks",
 *      description="Retrieve tasks for the authenticated user.",
 *      security={{"bearerAuth":{}}},
 *      @OA\Response(
 *          response=200,
 *          description="Tasks retrieved successfully",
 *          @OA\JsonContent(
 *
 *          ),
 *      ),
 *      @OA\Response(
 *          response=401,
 *          description="Unauthenticated",
 *          @OA\JsonContent(
 *              @OA\Property(property="success", type="boolean", example=false),
 *              @OA\Property(property="message", type="string", example="Unauthenticated"),
 *          ),
 *      ),
 *      @OA\Response(
 *          response=500,
 *          description="Server error",
 *          @OA\JsonContent(
 *              @OA\Property(property="success", type="boolean", example=false),
 *              @OA\Property(property="message", type="string", example="Error fetching tasks"),
 *              @OA\Property(property="error", type="string", example="Internal Server Error"),
 *          ),
 *      ),
 * )
 */
    public function read(Request $request)
    {
        try {

            $user = $request->user();
            $tasks = Task::where('user_id', $user->id)->get();

            return response()->json([
                'tasks' => $tasks,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching tasks',
                'error' => $e->getMessage(),
            ]);
        }
    }



}
