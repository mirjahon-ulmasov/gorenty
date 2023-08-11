import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { Layout } from 'antd';
import { ROLE, Route } from 'types/index';
import routes from './routes';
import { SArrowLeftIcon } from 'assets/images/Icons';

const { Sider } = Layout;

interface SiderProps {
    userRole: ROLE;
}

function Sidebar({ userRole }: SiderProps) {
    const [collapsed, setCollapsed] = useState(true);
    const [links, setLinks] = useState<Route[]>([]);
    const [hoveredIdx, setHoveredIdx] = useState<null | number>(null);

    const handleMouseEnter = (index: number) => {
        setHoveredIdx(index);
    };
      
    const handleMouseLeave = () => {
        setHoveredIdx(null);
    };
  

    useEffect(() => {
        // Filter routes based on user's role
        setLinks(routes.filter((route) => route.roles?.includes(userRole)));
    }, [userRole]);

    return (
        <StyledSider collapsedWidth={96} width={270} collapsed={collapsed}>
            <div className="container">
                <button className='close' type="button" onClick={() => setCollapsed((prev) => !prev)}>
                    <SArrowLeftIcon />
                    <span>Menyu</span>
                </button>
                <ul className="nav-links">
                    {links.map((link, index) => (
                        <li key={index}>
                            <NavLink 
                                onMouseEnter={() => handleMouseEnter(index)} 
                                onMouseLeave={handleMouseLeave} 
                                className={({ isActive }) => isActive ? 'active' : ''} 
                                to={link.path}
                            >
                                {React.createElement(link.icon, { color: hoveredIdx === index ? 'white' : '#ffffffaa' })}
                                <span>{link.title}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </StyledSider>
    );
}

export default Sidebar;

const StyledSider = styled(Sider)`
    height: calc(100vh - 82px);
    background-color: #1a1a1ae0 !important;
    border-right: 1px solid rgba(27, 16, 5, 0.06);
    overflow-y: auto;
    overflow-x: hidden;

    .container {
        padding: 24px;

        svg {
            width: 18px;
            height: 18px;
        }
        button.close {
            position: relative;
            margin-bottom: 8px;
            border: none;
            background: none;
            font-size: 16px;
            padding: 12px 16px;
            color: #ffffffa5;
            padding-left: ${(p) => (p.collapsed ? '16px' : 0)};

            svg {
                transform: ${(p) => (p.collapsed ? 'rotate(180deg)' : 'rotate(0deg)')};;
            }
            span {
                position: absolute;
                width: max-content;
                top: 11px;
                left: 24px;
                transition: 0.15s linear;
                opacity: ${(p) => (p.collapsed ? 0 : 1)};
            }
        }

        ul.nav-links {
            display: flex;
            gap: .5rem;
            flex-direction: column;
            li {
                position: relative;
                list-style: none;
                cursor: pointer;
                
                a {
                    text-decoration: none;
                    display: block;
                    height: 40px;
                    font-size: 16px;
                    color: #ffffffa5;                    
                    border-radius: 4px;
                    padding: 12px 16px;
                    transition: all 0.1s linear;

                    span {
                        position: absolute;
                        width: max-content;
                        top: 10px;
                        left: 54px;
                        display: ${(p) => (p.collapsed ? 'none' : 'inline')};
                        transition: 0.15s linear;
                    }                
                    &:hover, &.active {
                        background: #525252;                        
                        color: #FFFFFF;
                    }
                }
            }
        }
    }
`;