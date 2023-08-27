import {DatePicker, Form, Modal, Select} from "antd";
import Input from "antd/es/input/Input";
import {Option} from "antd/es/mentions";
import dayjs from 'dayjs';
import React, {forwardRef, useEffect, useState} from "react";
const dateFormat = 'YYYY-MM-DD';

const UserForm = forwardRef((props,ref) =>{

    const {regionList,roleList, isUpdateDisabled,isUpdate} = props;

    const [isDisabled,setIsDisabled] = useState(false);

    useEffect(()=>{
        setIsDisabled(isUpdateDisabled);
    },[isUpdateDisabled])

    const {roleId,region} = JSON.parse(localStorage.getItem('token'));

    const checkRegionDisabled = (item) => {
        //変更業務
        if(isUpdate===1){
            //superAdminの場合
            if(roleId===1){
                return false;
            }else{
                return true;
            }
        //追加業務
        }else {
            //superAdminの場合
            if(roleId===1){
                return false;
            }else{
               return region !== item.value;
            }
        }
    }
    const checkRoleDisabled = (item) => {
        //変更業務
        if(isUpdate===1){
            //superAdminの場合
            if(roleId===1){
                return false;
            }else{
                return roleId >= item.id;
            }
        //追加業務
        }else {
            //superAdminの場合
            if(roleId===1){
                return false;
            }else{
               return roleId >= item.id;
            }
        }
    }

    return(
            <Form ref={ref}
                layout="vertical"
            >
                <Form.Item
                    name="name"
                    label="名前"
                    rules={[
                        {
                            required: true,
                            message: '名前をご入力ください!',
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="birthday"
                    label="生年月日"
                    rules={[
                        {
                            required: true,
                            message: '生年月日をご入力ください!',
                        },
                    ]}
                >
                    <DatePicker defaultValue={dayjs('2023/08/27', dateFormat)} format={dateFormat} />
                </Form.Item>

                <Form.Item
                    name="nationalityName"
                    label="国籍"
                    rules={[
                        {
                            required: true,
                            message: '国籍をご入力ください!',
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    name="genderCd"
                    label="性別"
                    rules= {[
                        {
                            required: true,
                            message: '性別をお選びください!',
                        },
                    ]}
                >
                    <Select>
                        <Select.Option value='01'  key='01'>女性</Select.Option>
                        <Select.Option value='02'  key='02'>男性</Select.Option>
                        <Select.Option value='03'  key='03'>不明</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
    )
})
export default UserForm;