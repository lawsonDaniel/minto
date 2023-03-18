import { useConnect } from "wagmi";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Button,
} from "@chakra-ui/react";
import { VscChevronDown } from "react-icons/vsc";


export function Profile() {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  return (
    <div className="mt-10 flex flex-col gap-[10px]">
      <Menu>
        <MenuButton
          as={Button}
          w="200px"
          rounded="0"
          h="60px"
          style={{
            color: "#fff",
            background: "#000",
          }}
           rightIcon={<VscChevronDown/>}
        >
          Connect Wallet
        </MenuButton>
        <MenuList>
          {connectors
            .filter((connector) => connector.ready)
            .map((connector) => (
              <MenuItem
                key={connector?.id}
                className="bg-black text-xl text-[100] h-[60px] w-[200px] text-white"
                onClick={() => connect({ connector })}
              >
                {connector.name}
                {isLoading &&
                  connector?.id === pendingConnector?.id &&
                  " (connecting)"}
              </MenuItem>
            ))}
        </MenuList>
      </Menu>

      {error && <div className="text-red-500">{error.message}</div>}
    </div>
  );
}
