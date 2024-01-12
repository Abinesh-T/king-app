import { Button, Flex, PasswordInput, Text, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form';
import AppHeader from 'components/AppHeader';
import React from 'react'
import { useNavigate } from 'react-router';

const Login = () => {
    const navigate = useNavigate();

    const loginForm = useForm({
        validateInputOnBlur: true,
        defaultValues: {
            username: "",
            password: "",
        }
    })

    const handleLogin = async (values) => {
        const payload = values;
        localStorage.setItem("access_token", "token");
        navigate("/");
        // await api_login(payload).then(
        //     res => {
        //         if (res.sucess) {
        //             console.log(res);
        //             localStorage.setItem("access_token", res.token);
        //             localStorage.setItem("username", res.user.username);
        //             navigate("/user");
        //             showSuccessToast({ title: "Success", message: res.message });
        //         } else {
        //             showErrorToast({ title: "Error", message: res.message });
        //         }
        //     }
        // ).catch(err => {
        //     console.log(err);
        // })
    }

    return (
        <>
            <AppHeader />
            <Flex h={"100%"} align={"center"} justify={"center"}>
                <form onSubmit={loginForm.onSubmit(handleLogin)}>
                    <Flex p={20} bg={"rgba(255,255,255,1)"} miw={350} h={"100%"} align={"center"} justify={"center"} direction={'column'} gap={20}>
                        <Text fz={26} fw={600} ta={"center"} w={"100%"}>Login</Text>
                        <TextInput w={"100%"}
                            label="Username"
                            placeholder='Enter Username'
                            {...loginForm.getInputProps("username")}
                        />
                        <PasswordInput w={"100%"}
                            label="Password"
                            placeholder='Enter Password'
                            {...loginForm.getInputProps("password")}
                        />
                        <Button type='submit' w={"100%"}>Login</Button>
                    </Flex>
                </form>
            </Flex>
        </>
    )
}

export default Login