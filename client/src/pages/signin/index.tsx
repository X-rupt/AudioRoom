import { useForm, SubmitHandler } from "react-hook-form";
import  { yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PEOPLES_IMAGES } from "../../images";
import Cookies from "universal-cookie";
import { StreamVideoClient, User } from "@stream-io/video-react-sdk";
import { useUser } from "../../user-context";
import { useNavigate } from "react-router-dom";


interface FormValues {
    username: string;
    name: string;
}

export const SignIn = () => {
    const cookies = new Cookies(); 
    const {setUser, setClient} = useUser();
    const navigate = useNavigate();

    const schema= yup.object().shape({
        username: yup
        .string()
        .required("Username is Required")
        .matches(/^[a-zA-Z0-9_.@$]+$/, "Invalid Username"),
        name: yup.string().required("Name is Required")
    });

    const onSubmit: SubmitHandler<FormValues> = async(data, event) => {
      event?.preventDefault();
      const {username, name} = data;
      const response = await fetch("http://localhost:3001/auth/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          name,
          image: PEOPLES_IMAGES[Math.floor(Math.random() * PEOPLES_IMAGES.length)],
        }),
      });

      if(!response.ok) {
        alert("some error occured while signing in");
        return;
      }
      const responseData = await response.json();
      console.log(responseData);

      const user: User = {
        id: username,
        name,
      }

      const myClient = new StreamVideoClient({
        apiKey: "djp83vvudx6v",
        user,
        token: responseData.token,
      });


      const expires = new Date(); 
      expires.setDate(expires.getDate() + 1);
      cookies.set("token", responseData.token, {
       expires,
      });
      cookies.set("username", responseData.username, {
        expires,
       });
       cookies.set("name", responseData.name, {
        expires,
       });
       setClient(myClient);
       setUser({username, name});
       navigate("/");
      
    };

    const {register,
           handleSubmit,
           formState: {errors},
        } = useForm<FormValues>({ resolver: yupResolver(schema)});

    return (
      <div className="sign-in"><h1>Welcome to my Audio chats</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
        <label>UserName:</label>
        <input type="text" {...register("username")}/>
        {errors.username &&(<p style={{color: "red"}}>{errors.username.message}</p>)}
        </div>
        <div>
        <label>Name:</label>
        <input type="text" {...register("name")}/>
            {errors.name &&(<p style={{color: "red"}}>{errors.name.message}</p>)}
        </div>
        <button type="submit">Sign In</button>
      </form>
      </div>
    );
  };
  