import React from 'react'
import styled from 'styled-components'
import { Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const paddingLeft = 'padding-left: 20px'
const paddingTop = 'padding-top: 20px'

const ChannelWrapper = styled.div`
    grid-column: 2;
    grid-row: 1 / 4;
    background-color: #4e3a4c;
    color: #958993;
`

const TeamNameHeader = styled.h1`
    color: #fff;
    ${paddingTop}
    font-size: 20px;
`

const SideBarList = styled.ul`
    width: 100%;
    list-style: none;
    padding-left: 0px;
`

const SideBarListItem = styled.li`
    padding: 2px;
    ${paddingLeft};
    &:hover {
        background: #3e313c;
    }
`

const SideBarListHeader = styled.li`
    ${paddingLeft};
`

const PushLeft = styled.div`
    ${paddingLeft};
    ${paddingTop}
`
const Invite = styled.div`
    ${paddingLeft}
`
const Green = styled.span`
    color: #38978d;
`

const Bubble = ({ on = true }) => (on ? <Green>●</Green> : '○')

const channel = ({ id, name }, teamId) => (
    <Link key={`channel-${id}`} to={`/view-team/${teamId}/${id}`}>
        <SideBarListItem># {name}</SideBarListItem>
    </Link>
)

const user = ({ id, name }) => (
    <SideBarListItem key={`user-${id}`}>
        <Bubble /> {name}
    </SideBarListItem>
)

export default ({
    teamName,
    username,
    isOwner,
    channels,
    users,
    onAddChannels,
    teamId,
    onInvitePeopleClick,
}) => (
    <ChannelWrapper>
        <PushLeft>
            <TeamNameHeader>{teamName}</TeamNameHeader>
            {username}
        </PushLeft>
        <div>
            <SideBarList>
                <SideBarListHeader>
                    Channels
                    {isOwner && (
                        <Icon onClick={onAddChannels} name={'add circle'} />
                    )}
                </SideBarListHeader>
                {channels && channels.map((c) => channel(c, teamId))}
            </SideBarList>
        </div>
        <div>
            <SideBarList>
                <SideBarListHeader>Direct Messages</SideBarListHeader>
                {users.map(user)}
            </SideBarList>
        </div>
        {isOwner && (
            <Invite>
                <a href="#invite-people" onClick={onInvitePeopleClick}>
                    + Invite People
                </a>
            </Invite>
        )}
    </ChannelWrapper>
)
