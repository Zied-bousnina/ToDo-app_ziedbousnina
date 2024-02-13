<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\RegisterUser;
use App\Mail\SendCodeResetPassword;
use App\Models\ResetCodePassword;
use App\Models\ResetCodePassword2;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessTokenFactory;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
class UserController extends Controller
{

/**
 * Register a new user.
 *
 * @OA\Post(
 *      path="/api/user/create",
 *      operationId="registerUser",
 *      tags={"User"},
 *      summary="Register a new user",
 *      description="Creates a new user account with the provided information.",
 *      @OA\RequestBody(
 *          required=true,
 *          @OA\JsonContent(
 *              required={"name", "email", "phone", "first_name", "password"},
 *              @OA\Property(property="name", type="string", description="User's name"),
 *              @OA\Property(property="email", type="string", format="email", description="User's email address"),
 *              @OA\Property(property="phone", type="string", description="User's phone number"),
 *              @OA\Property(property="first_name", type="string", description="User's first name"),
 *              @OA\Property(property="password", type="string", format="password", description="User's password"),
 *          ),
 *      ),
 *      @OA\Response(
 *          response=200,
 *          description="User created successfully",
 *          @OA\JsonContent(
 *              @OA\Property(property="success", type="boolean", example=true),
 *              @OA\Property(property="message", type="string", example="User created successfully"),
 *
 *          ),
 *      ),
 *      @OA\Response(
 *          response=400,
 *          description="Invalid input",
 *          @OA\JsonContent(
 *              @OA\Property(property="success", type="boolean", example=false),
 *              @OA\Property(property="message", type="string", example="Error creating user"),
 *              @OA\Property(property="error", type="string", example="Error message details"),
 *          ),
 *      ),
 *      @OA\Response(
 *          response=500,
 *          description="Server error",
 *          @OA\JsonContent(
 *              @OA\Property(property="success", type="boolean", example=false),
 *              @OA\Property(property="message", type="string", example="Error creating user"),
 *              @OA\Property(property="error", type="string", example="Internal Server Error"),
 *          ),
 *      ),
 * )
 *
 * @param \App\Http\Requests\RegisterUser $request
 * @return \Illuminate\Http\JsonResponse
 */
    public function register(RegisterUser $request)
    {
        try {

            $user = new User();
            $user->name = $request->name;
            $user->email = $request->email;
            $user->phone = $request->phone;
            $user->first_name = $request->first_name;
            $user->password = bcrypt($request->password);
            $user->save();


            Log::info('User created successfully', ['user_id' => $user->id]);

            return response()->json([
                'success' => true,
                'message' => 'User created successfully',
                'data' => $user,
            ]);
        } catch (\Exception $e) {
            Log::error('Error creating user', ['error_message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Error creating user',
                'error' => $e->getMessage(),
            ]);
        }
    }

/**
 * User login.
 *
 * @OA\Post(
 *      path="/api/user/login",
 *      operationId="loginUser",
 *      tags={"User"},
 *      summary="User login",
 *      description="Logs in a user with the provided credentials.",
 *      @OA\RequestBody(
 *          required=true,
 *          @OA\JsonContent(
 *              required={"email", "password"},
 *              @OA\Property(property="email", type="string", format="email", description="User's email address"),
 *              @OA\Property(property="password", type="string", format="password", description="User's password"),
 *          ),
 *      ),
 *      @OA\Response(
 *          response=200,
 *          description="Login successful",
 *          @OA\JsonContent(
 *              @OA\Property(property="success", type="boolean", example=true),
 *              @OA\Property(property="message", type="string", example="User logged in successfully"),
 *              @OA\Property(property="data", type="object",
 *
 *                @OA\Property(property="token", type="string", example="2|kzv ... 3|kzv ... 4|kzv ..."),
 *              ),
 *          ),
 *      ),
 *      @OA\Response(
 *          response=401,
 *          description="Unauthorized",
 *          @OA\JsonContent(
 *              @OA\Property(property="success", type="boolean", example=false),
 *              @OA\Property(property="message", type="string", example="Invalid credentials"),
 *          ),
 *      ),
 *      @OA\Response(
 *          response=422,
 *          description="Validation error",
 *          @OA\JsonContent(
 *              @OA\Property(property="success", type="boolean", example=false),
 *              @OA\Property(property="message", type="string", example="Validation error"),
 *              @OA\Property(property="errors", type="object", example={"email": {"The email field is required."}}),
 *          ),
 *      ),
 *      @OA\Response(
 *          response=500,
 *          description="Server error",
 *          @OA\JsonContent(
 *              @OA\Property(property="success", type="boolean", example=false),
 *              @OA\Property(property="message", type="string", example="Error during login"),
 *              @OA\Property(property="error", type="string", example="Internal Server Error"),
 *          ),
 *      ),
 * )
 */
    public function login(LoginUserRequest $request)
    {
        try {
            // Validate the request
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            // Attempt to log the user in
            if (auth()->attempt($request->only('email', 'password'))) {
                // The user is logged in
                $user = auth()->user();
                $token = $user->createToken('token-name')->plainTextToken;

                // Log successful login
                Log::info('User logged in successfully', ['user_id' => $user->id]);

                return response()->json([
                    'success' => true,
                    'message' => 'User logged in successfully',
                    'data' => [
                        'user' => $user,
                        'token' => $token,
                    ],
                ]);
            }

            // Log unsuccessful login
            Log::warning('Invalid login attempt', ['email' => $request->email]);

            // The user is not logged in
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials',
            ], 401);
        } catch (\Exception $e) {
            // Handle the exception
            Log::error('Error during login', ['error_message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Error during login',
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
 * User logout.
 *
 * @OA\Post(
 *      path="/api/user/logout",
 *      operationId="logoutUser",
 *      tags={"User"},
 *      summary="User logout",
 *      description="Logs out the authenticated user and revokes access tokens.",
 *      security={{"bearerAuth":{}}},
 *      @OA\Response(
 *          response=200,
 *          description="Logout successful",
 *          @OA\JsonContent(
 *              @OA\Property(property="success", type="boolean", example=true),
 *              @OA\Property(property="message", type="string", example="User logged out successfully"),
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
 *              @OA\Property(property="message", type="string", example="Error during logout"),
 *              @OA\Property(property="error", type="string", example="Internal Server Error"),
 *          ),
 *      ),
 * )
 */
    public function logout(Request $request)
    {
        try {
            $user = $request->user();
            $user->tokens()->delete();

            // Log successful logout
            Log::info('User logged out successfully', ['user_id' => $user->id]);

            return response()->json([
                'success' => true,
                'message' => 'User logged out successfully',
            ]);
        } catch (\Exception $e) {
            // Handle the exception
            Log::error('Error during logout', ['error_message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Error during logout',
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
 * Check the validity of a password reset code.
 *
 * @OA\Post(
 *      path="/api/password/code/check",
 *      operationId="checkPasswordResetCode",
 *      tags={"Password"},
 *      summary="Check password reset code",
 *      description="Check the validity of a password reset code.",
 *      @OA\RequestBody(
 *          required=true,
 *          @OA\JsonContent(
 *              required={"code"},
 *              @OA\Property(property="code", type="string", description="Password reset code"),
 *          ),
 *      ),
 *      @OA\Response(
 *          response=200,
 *          description="Code is valid",
 *          @OA\JsonContent(
 *              @OA\Property(property="code", type="string", example="ABC123"),
 *              @OA\Property(property="message", type="string", example="Code is valid"),
 *          ),
 *      ),
 *      @OA\Response(
 *          response=404,
 *          description="Code not found",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="Code not found"),
 *          ),
 *      ),
 *      @OA\Response(
 *          response=422,
 *          description="Code is expired",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="Code is expired"),
 *          ),
 *      ),
 *      @OA\Response(
 *          response=500,
 *          description="Server error",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="Internal Server Error"),
 *          ),
 *      ),
 * )
 */
    public function checkCode(Request $request)
    {
        try {
            // find the code
            $passwordReset = ResetCodePassword2::firstWhere('code', $request->code);

            // check if the code exists
            if (!$passwordReset) {
                return response(['message' => trans('passwords.code_not_found')], 404);
            }

            // check if it does not expire: the time is one hour
            if ($passwordReset->created_at > now()->addHour()) {
                $passwordReset->delete();
                return response(['message' => trans('passwords.code_is_expire')], 422);
            }

            return response([
                'code' => $passwordReset->code,
                'message' => trans('passwords.code_is_valid')
            ], 200);
        } catch (\Exception $e) {
            return response(['message' => $e->getMessage()], 500);
        }
    }

    /**
 * Reset user password using a valid reset code.
 *
 * @OA\Post(
 *      path="/api/password/reset",
 *      operationId="resetUserPassword",
 *      tags={"Password"},
 *      summary="Reset user password",
 *      description="Reset user password using a valid reset code.",
 *      @OA\RequestBody(
 *          required=true,
 *          @OA\JsonContent(
 *              required={"code", "password"},
 *              @OA\Property(property="code", type="string", description="Password reset code"),
 *              @OA\Property(property="password", type="string", format="password", description="New password"),
 *          ),
 *      ),
 *      @OA\Response(
 *          response=200,
 *          description="Password reset successful",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="Password has been successfully reset"),
 *          ),
 *      ),
 *      @OA\Response(
 *          response=404,
 *          description="Code not found",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="Code not found"),
 *          ),
 *      ),
 *      @OA\Response(
 *          response=422,
 *          description="Code is expired",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="Code is expired"),
 *          ),
 *      ),
 *      @OA\Response(
 *          response=500,
 *          description="Server error",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="Internal Server Error"),
 *          ),
 *      ),
 * )
 */
    public function reset(Request $request)
    {
        try {
            // find the code
            $passwordReset = ResetCodePassword2::firstWhere('code', $request->code);

            // check if the code exists
            if (!$passwordReset) {
                return response(['message' => trans('passwords.code_not_found')], 404);
            }

            // check if it does not expire: the time is one hour
            if ($passwordReset->created_at > now()->addHour()) {
                $passwordReset->delete();
                return response(['message' => trans('passwords.code_is_expire')], 422);
            }

            // find user's email
            $user = User::firstWhere('email', $passwordReset->email);

            // update user password
            $user->update(['password' => bcrypt($request->password)]);


            // delete current code
            $passwordReset->delete();

            return response(['message' => 'password has been successfully reset'], 200);
        } catch (\Exception $e) {
            return response(['message' => $e->getMessage()], 500);
        }
    }


    /**
 * Send a password reset link to the user's email.
 *
 * @OA\Post(
 *      path="/api/password/email",
 *      operationId="sendPasswordResetLink",
 *      tags={"Password"},
 *      summary="Send password reset link",
 *      description="Send a password reset link to the user's email.",
 *      @OA\RequestBody(
 *          required=true,
 *          @OA\JsonContent(
 *              required={"email"},
 *              @OA\Property(property="email", type="string", format="email", description="User's email address"),
 *          ),
 *      ),
 *      @OA\Response(
 *          response=200,
 *          description="Password reset link sent successfully",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="Password reset link sent successfully"),
 *          ),
 *      ),
 *      @OA\Response(
 *          response=422,
 *          description="Validation error",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="The given data was invalid."),
 *              @OA\Property(property="errors", type="object", example={"email": {"The email field is required."}}),
 *          ),
 *      ),
 *      @OA\Response(
 *          response=500,
 *          description="Server error",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="Internal Server Error"),
 *          ),
 *      ),
 * )
 */
public function sendResetLinkEmail(Request $request)
{
    try {
        $data = $request->validate([
            'email' => 'required|email|exists:users',
        ]);

        // Delete all old code that user sent before.
        ResetCodePassword2::where('email', $request->email)->delete();

        // Generate random code
        $data['code'] = mt_rand(100000, 999999);

        // Create a new code
        $codeData = ResetCodePassword2::create($data);

        // Send email to user
        Mail::to($request->email)->send(new SendCodeResetPassword($codeData->code));

        return response(['message' => trans('passwords.sent')], 200);
    } catch (\Exception $e) {
        return response(['message' => $e->getMessage()], 500);
    }
}





}
