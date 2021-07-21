import React from "react";
import { Form, Input, InputNumber, Modal, Button, notification } from "antd";
// import { SmileOutlined, UserOutlined } from "@ant-design/icons";
// import { FormInstance } from "antd/lib/form";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "@ethersproject/contracts";
import BonsaiBank from "../artifacts/contracts/BonsaiBank.json";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import GrowBonsai from "./GrowBonsai";
const { confirm } = Modal;
// import Web3Context from "../context/Web3Context";

function DestroyBonsai(props) {
	// const details = useContext(Web3Context);
	// const { accounts, contract, web3 } = details.current;
	const web3React = useWeb3React();
	// console.log(web3React);
	const [visible, setVisible] = React.useState(false);
	const [confirmLoading, setConfirmLoading] = React.useState(false);

	const [form] = Form.useForm();

	const openNotification = () => {
		notification["success"]({
			message: "Success!",
			description: "Bonsai destroyed successfully!",
			duration: 2.5,
			onClick: () => {
				console.log("Notification Clicked!");
			},
		});
	};

	const openFailNotification = () => {
		notification["error"]({
			message: "Fail!",
			description: "Bonsai destroy failed!",
			duration: 2.5,
			onClick: () => {
				console.log("Notification Clicked!");
			},
		});
	};

	const showModal = () => {
		setVisible(true);
	};

	const onOk = () => {
		setConfirmLoading(true);
		// form.submit();
		GrowBonsai();
	};

	const onCancel = () => {
		setVisible(false);
	};

	async function DestroyBonsai() {
		const contract = new Contract(
			BonsaiBank.networks[web3React.chainId].address,
			BonsaiBank.abi,
			web3React.library.getSigner()
		);
		// console.log(contract);
		if (typeof contract !== undefined)
			await contract
				.destroy(props.bonsaiID)
				.then((response) => {
					console.log(response);
					setVisible(false);
					setConfirmLoading(false);
					openNotification();
				})
				.catch((error) => {
					setVisible(false);
					setConfirmLoading(false);
					console.log(error.message);
					openFailNotification();
				});
	}

	const onFinish = async (values) => {
		console.log("Success:", values);
		//TO DO: Add function to fire a query to handle addition of subscriber data.
		await DestroyBonsai(values);
		// setVisible(false);
		// setConfirmLoading(false);
	};

	function showConfirm() {
		confirm({
			title: "Are you sure you want to destroy the bonsai?",
			icon: <ExclamationCircleOutlined />,

			onOk: onOk,
			onCancel() {
				console.log("Cancel");
			},
		});
	}

	return (
		<>
			{web3React.active && (
				<>
					<Button type="primary" onClick={showConfirm}>
						Destroy
					</Button>
				</>
			)}
		</>
	);
}

export default DestroyBonsai;
