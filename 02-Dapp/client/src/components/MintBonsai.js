import React from "react";
import { Form, Input, InputNumber, Modal, Button, notification } from "antd";
// import { SmileOutlined, UserOutlined } from "@ant-design/icons";
// import { FormInstance } from "antd/lib/form";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "@ethersproject/contracts";
import BonsaiBank from "../contracts/BonsaiBank.json";
// import Web3Context from "../context/Web3Context";

function MintBonsai() {
	// const details = useContext(Web3Context);
	// const { accounts, contract, web3 } = details.current;
	// console.log(myData);
	const web3React = useWeb3React();
	// console.log(web3React);
	const [visible, setVisible] = React.useState(false);
	const [confirmLoading, setConfirmLoading] = React.useState(false);

	const [form] = Form.useForm();

	const openNotification = () => {
		notification["success"]({
			message: "Success!",
			description: "Bonsai created successfully!",
			duration: 2.5,
			onClick: () => {
				console.log("Notification Clicked!");
			},
		});
	};

	const openFailNotification = () => {
		notification["error"]({
			message: "Fail!",
			description: "Bonsai creation failed!",
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
		form.submit();
	};

	const onCancel = () => {
		setVisible(false);
	};

	async function CreateABonsai(values) {
		console.log(values);
		// console.log(web3React.library.getSigner());
		console.log(web3React.chainId);
		const contract = new Contract(
			BonsaiBank.networks[web3React.chainId].address,
			BonsaiBank.abi,
			web3React.library.getSigner()
		);
		// console.log(contract);
		console.log(values);
		if (typeof contract !== undefined)
			await contract.getBotanist().then((response) => {
				console.log(response);
				// setVisible(false);
				// setConfirmLoading(false);
			});
		await contract
			.mint(values.caretaker, values.bonsaiURI)
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
		// console.log("Success:", values);
		await CreateABonsai(values);
	};

	return (
		<>
			{web3React.active && (
				<>
					<Button type="primary" onClick={showModal}>
						Create a new bonsai
					</Button>
					<Modal
						title="Create a new bonsai!"
						visible={visible}
						onOk={onOk}
						onCancel={onCancel}
						confirmLoading={confirmLoading}
					>
						<Form
							form={form}
							layout="vertical"
							name="userForm"
							onFinish={onFinish}
						>
							<Form.Item
								name="caretaker"
								label="Caretaker"
								rules={[{ required: true }]}
							>
								<Input />
							</Form.Item>
							<Form.Item
								name="bonsaiURI"
								label="Bonsai URI"
								rules={[{ required: true }]}
							>
								<Input />
							</Form.Item>
						</Form>
					</Modal>
				</>
			)}
		</>
	);
}

export default MintBonsai;
