import React from 'react';
import './Breadcrumb.scss';
import { 
  Breadcrumbs, 
  Link, 
  Typography 
} from '@material-ui/core'

const Breadcrumb = ({ linkBreadcrumb, typography }) => {  
  return (
    <Breadcrumbs className="con-breadcrumps" separator="">
      {linkBreadcrumb.map((link, index) => (
        <Link className="name" href={link.url} key={index}>
        {link.name}
        <span>{">"}</span>
        </Link>
      ))}
      <Typography className="typography">{typography}</Typography>
    </Breadcrumbs>
  )
}

export default Breadcrumb;