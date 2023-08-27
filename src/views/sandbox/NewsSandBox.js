import React, {useEffect} from 'react'
import {Layout,  theme} from "antd";
import {Content, Header} from "antd/es/layout/layout";
import './NewsSandBox.css';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'
import {Redirect, Route, Switch} from "react-router-dom";
import Login from "../login/Login";
import Home from "./home/Home";
import Update from "./emp-manage/Update";
import Add from "./emp-manage/Add";
import Delete from "./emp-manage/Delete";
import NoPermission from "./nopermission/NoPermisson";

export default function NewsSandBox() {

    NProgress.start();
    useEffect(()=>{
        NProgress.done();
    })

    const {
        token: {colorBgContainer},
    } = theme.useToken();

    return (


                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        //background: colorBgContainer,
                        overflow: 'auto'
                    }}
                >
                    <Switch>
                        <Route path="/home" component={Home}/>
                        <Route path="/update/:id" component={Update}/>
                        <Route path="/add" component={Add}/>
                        <Route path="/delete" component={Delete}/>
                        <Redirect from='/' to='/home' exact></Redirect>
                       <Route path="*" component={NoPermission}></Route>
                    </Switch>

                </Content>

    )
}
