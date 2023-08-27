import React from 'react'
import {HashRouter,Redirect,Route, Switch} from 'react-router-dom'
import Login from '../views/login/Login'
import NewsSandBox from '../views/sandbox/NewsSandBox'
import BackGround from '../resources/img/background1.jpg'
import {Layout} from "antd";
import {Content, Header} from "antd/es/layout/layout";
export default function IndexRouter() {
    return (
        <div style={{
            backgroundImage:`url(${BackGround})`,
            height: "100%",
            backgroundSize:'100% 100%',
            //backgroundAttachment: 'fixed',
        }}>
            <Header　style={{
                backgroundColor:'rgba(35,39,65,0)',
                fontSize:'50px',
                textAlign:'center',
                color:"brown",
            }} ><b>社員管理システム</b></Header>
        <HashRouter>
            <Switch>
                        <Route path="/login" component={Login}/>
                        <Route path="/" component={NewsSandBox}/>
                        <Route path="/" render={()=>
                            localStorage.getItem("token")?
                                <NewsSandBox></NewsSandBox>:
                                <Redirect to="/login"/>
                        }/>

            </Switch>
        </HashRouter>
        </div>
    )
}
