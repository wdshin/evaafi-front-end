import styled from "styled-components"
import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

export const BlueButton = styled.button`
	background: #0381C5;
	border: none;
	border-radius: 6.5px;
	color: #fff;
	cursor: pointer;
	font-size: 1.78rem;
	font-weight: 700;
	padding: 0.75rem 3rem;
`

export const MenuButton = styled(Menu.Button)`
	display: flex;;
	justify-content: center;
	align-items: center;
	background: #0088CC;
	border: none;
	color: #fff;
	cursor: pointer;
	font-size: 2rem;
	font-weight: 500;
	background-color: transparent;

	&:hover {
		opacity: 0.8;
	}
`

export const ChevronDown = styled(ChevronDownIcon)`
	margin-left: 1rem;
	height: 2.4rem;
	width: 2.4rem;
`

export const MenuItems = styled(Menu.Items)`
	position: absolute;
	transform-origin: top right;
	width: 100%;
`
export const MenuItemButton = styled.button`
	margin-top: 0.5rem;
	background: #fff;
	border: 3px solid #0088CC;
	border-radius: 5px;
	color: #000;
	width: 80%;
	font-size: 1.4rem;

`

interface WalletNumWithMenuProps {
	address: string
	onDisconnect: () => void
}

export const WalletNumWithMenu = ({address, onDisconnect} : WalletNumWithMenuProps) => {
	return (
		<div className="top-16 w-56 text-right z-10">
			<Menu as="div" className="relative inline-block text-left">
				<MenuButton>
					{address}
					<ChevronDown/>
				</MenuButton>
				<Transition
					as={Fragment}
					enter="transition ease-out duration-100"
					enterFrom="transform opacity-0 scale-95"
					enterTo="transform opacity-100 scale-100"
					leave="transition ease-in duration-75"
					leaveFrom="transform opacity-100 scale-100"
					leaveTo="transform opacity-0 scale-95"
				>
					<MenuItems>
						<Menu.Item>
							<MenuItemButton onClick={onDisconnect}>Disconnect</MenuItemButton>
						</Menu.Item>
					</MenuItems>
				</Transition>
			</Menu>
		</div>
	)
}
