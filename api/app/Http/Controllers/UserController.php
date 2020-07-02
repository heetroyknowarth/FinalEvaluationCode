<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Validator;

class UserController extends Controller
{
    /*
    Registering the user with the below Register function
    */

    public function register(Request $request)
    {
        $validate = $this->validateRequest();

        if ($validate)
        {
            $user = new User([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password)
            ]);
            $user->save();
        }

        return response()->json([
            'message' => 'Successfully created user!'
        ], 201);
    }



    /*
    Login function
    */

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email|exists:users,email',
            'password' => 'required|string',
            'remember_me' => 'boolean'
        ]);

        $email=User::where("email",$request->email)->first();
        if($email) {
            $credentials = request(['email', 'password']);
            if (!Auth::attempt($credentials))
                return response()->json(['message' => 'Email-Id or Password does not match'], 422);

            $user = $request->user();

            $tokenResult = $user->createToken('Personal Access Token');

            $token = $tokenResult->token;

            if ($request->remember_me)

                $token->expires_at = Carbon::now()->addWeeks(1);

            $token->save();
            return response()->json([
                'access_token' => $tokenResult->accessToken,
                'token_type' => 'Bearer',
                'expires_at' => Carbon::parse($tokenResult->token->expires_at)->toDateTimeString()
            ]);
        }
        else
        {
            return response()->json(['message' => 'Username does not exist.'], 422);
        }
    }

    /*
    Logout function
    */
    public function logout(Request $request)
    {
        $request->user()->token()->revoke();
        return response()->json(['message' => 'Successfully logged out']);
    }


    /*
    Fetch Authorized user data for users profile
    */


    public function fetchUser(Request $request)
    {
//        print_r($request->user());exit();
        return response()->json($request->user());
    }

    /*
    Post request to update users profile
    */


    public function updateProfile(Request $request){
        if ($request->has('avatar'))
        {
            $oldname = Auth::user()->avatar;
            if ($oldname != null){
                unlink(storage_path('app/public/'.$oldname));
            }

            $avatar = $request->file('avatar');

            $file = str_random(3).$avatar->getClientOriginalName();
            $avatar->storeAs('/public',$file);

        }

        Auth::user()->update(['avatar' => $file]);

        return response()->json($request->user());

    }

    /*
    Post request to update username
    */

    public function updateUsername(Request $request)
    {

        $name = $request->name;
        Auth::user()->update(['name' => $name]);
        return response()->json($request->user()->name);

    }
    /*
    Validation function used while Registering User
    */

    public function validateRequest(){
        return tap(
            \request()->validate([
                'name' => 'required|string',
                'email' => 'required|string|email|unique:users',
                'password' => 'required|string',
                'remember_me' => 'boolean']),
            function ()
            {
                if (\request()->hasFile('avatar'))
                {
                    \request()->validate(['avatar'=>'file|image|max:5000',]);
                }
            }
            );
    }

}
