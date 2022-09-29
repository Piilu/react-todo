import { Form, Input, Button, Row, Col, notification } from "antd";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function Login({checkAuth}) {
    const navigate = useNavigate();
    let GET_USER = "https://demo2.z-bit.ee/users/get-token"

    const onFinish = (values) => {
        console.log('Success:', values);
        axios.post(GET_USER,{username:values.username,password:values.password}).then(res=>{
            if(res.status==200){
                notification.success({
                    message: 'Logged in'
                });
                localStorage.setItem("accessKey",JSON.stringify(res.data))
                checkAuth();
                navigate("/");
            }
        }).catch(err=>{
            console.log(err)
            notification.error({
                message: 'Wrong username or password'
            });
        })
    };

    return (
        <Row type="flex" justify="center" align="middle" style={{minHeight: '100vh'}}>
            <Col span={4}>
                <h1>Login</h1>
                <Form
                    name="basic"
                    layout="vertical"
                    initialValues={{ username: "", password: "" }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Login</Button> <br/>
                        Or <a href="/register">register now!</a>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    )
}