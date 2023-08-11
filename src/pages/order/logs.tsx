import { useParams } from "react-router-dom";
import { Typography } from "antd";
import { CustomBreadcrumb, StyledTextL1 } from "components/input";
import { styled } from "styled-components";

const { Title } = Typography;

export default function OrderLogs() {
  const { orderID } = useParams();
    return (
        <>
            <CustomBreadcrumb
                items={[
                    { title: 'Buyurtmalar', link: '/order' },
                    { title: orderID as string, link: `/order/${orderID}/detail` },
                    { title: 'Buyurtma tarixi' },
                ]}
            />
            <Logs>
				<Title level={3}>Buyurtma tarixi</Title>
				<ul>
					{[1,2,3,4].map((_el, index) => (
						<li key={index}>
							<div className="index">{index + 1}</div>
							<StyledTextL1 fs={16}>
								Operator Farxod Ahmedov tomonidan, Yakksaroy filialdida, ID 67867623 bilan, 12:33 , 12-mart, 2022 da buyurtma ochildi
							</StyledTextL1>
						</li>
					))}
				</ul> 
			</Logs>
        </>
    )
}


const Logs = styled.div`
	max-width: 40rem;
	ul {
		li {
			list-style: none;
			padding: 24px 0;
			display: flex;
			gap: 16px;
			align-items: flex-start;
			border-bottom: 1px solid rgba(27, 16, 5, 0.06);
			&:last-child {
				border: none;
				padding-bottom: 0;
			}
			.index {
				font-size: 16px;
				font-weight: 500;
				padding: 6px 24px;
				border-radius: 8px;
				background: #FFF3EB;
			}
		}
	}
`