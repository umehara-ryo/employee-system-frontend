import React from 'react'
import Input from "antd/es/input/Input";
import {Button, Form, message} from "antd";
import './Login.css';
import axios from "axios";


export default function Login(props) {

    const onFinish = (values) => {
        console.log(values);
        // axios.get(`/employee/login/?accountId=${values.accountId}&password=${values.password}`).then(res=>{
        // }).then(res=>{
        //     console.log(res);
        //     if(res != undefined && res.data.data.length===1){
        //         localStorage.setItem('token',JSON.stringify(res.data.data[0]));
        //         //console.log(res.data[0]);
        //         props.history.push('/');
        //     }else {
        //         message.error("ユーザー名とパスワードを正しく入力してください！")
        //     }
        // })

        axios.post(`/employee/login`, {
            accountId: values.accountId,
            password: values.password
        }).then(res => {
            console.log(res);
            if (res != undefined && res.data.data.length === 1) {
                localStorage.setItem('token', JSON.stringify(res.data.data[0]));
                //console.log(res.data[0]);
                props.history.push('/');
            } else {
                message.error("ユーザー名とパスワードを正しく入力してください！")
            }
        })
    }

    return (
        <div style={{
            //background:'#FDADCA',
            //background:'rgb(35,39,65)',
        }}>
            <div className='formContainer'>
                <div className='title' style={{
                    color: '#337ab7'
                }}>ログイン
                </div>
                <Form
                    name="normal_login"
                    className="login-form"
                    onFinish={onFinish}
                >
                    <div className='subTitle'>ユーザーID</div>

                    <Form.Item
                        name="accountId"
                        rules={[
                            {
                                required: true,
                                message: 'ユーザー名をご入力ください!',
                            },
                        ]}
                    >
                        <Input //prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="Emailアドレスを入力してください"/>
                    </Form.Item>

                    <div className='subTitle'>パスワード</div>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'パスワードをご入力ください!',
                            },
                        ]}
                    >
                        <Input
                            //prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="パスワードを入力してください"
                        />

                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" style={{
                            margin: '0 auto',
                            display: 'block',
                            backgroundColor: '#337ab7'
                        }} htmlType="submit" className="login-form-button">
                            ログイン
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
