import React from 'react';
import { Collapse, Icon, useDisclosure } from '@chakra-ui/react';
import { NavLink as RouterDomLink } from 'react-router-dom';
import { MdKeyboardArrowRight } from 'react-icons/md';
import withAuth from '../../store/utils/withAuth';
import NavItem from './NavItem';

const NavItemController = ({ auth, menu, color, nestedChildrenMenu = 4 }) => {
  const collapse = useDisclosure({defaultIsOpen: true});
  const { name, icon, to, children, permission } = menu;

  if (permission) {
    if (!Array.isArray(permission) && !auth.permissions.includes(permission)) {
      return <React.Fragment />;
    } else if (
      Array.isArray(permission) &&
      !auth.permissions.some((p) => permission.indexOf(p) !== -1)
    ) {
      return <React.Fragment />;
    }
  }

  if (to) {
    return (
      <NavItem 
        pl={nestedChildrenMenu}
        color={color}
        icon={icon}
        as={RouterDomLink}
        to={to}
      >
        {name}
      </NavItem>
    );
  }

  return (
    <>
      <NavItem
        pl={nestedChildrenMenu}
        color={color}
        icon={icon}
        onClick={collapse.onToggle}
      >
        {name}
        <Icon
          as={MdKeyboardArrowRight}
          ml='auto'
          transition='.25s ease'
          transform={collapse.isOpen && 'rotate(90deg)'}
        />
      </NavItem>
      <Collapse in={collapse.isOpen}>
        {children.map((menuChildren) => {
          if (menuChildren.children) {
            return (
              <NavItemController
                key={menuChildren.name}
                menu={menuChildren}
                color={color}
                nestedChildrenMenu={nestedChildrenMenu + 8}
                auth={auth}
              />
            );
          }

          if (
            menuChildren.permission &&
            !auth.permissions.includes(menuChildren.permission)
          ) {
            return <React.Fragment />;
          }

          return (
            <NavItem
              color={color}
              as={RouterDomLink}
              to={menuChildren.to}
              pl={nestedChildrenMenu + 8}
              py='2'
              key={menuChildren.name}
            >
              {menuChildren.name}
            </NavItem>
          );
        })}
      </Collapse>
    </>
  );
};

export default withAuth(NavItemController);
