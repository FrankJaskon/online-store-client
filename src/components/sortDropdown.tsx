import { observer } from 'mobx-react-lite'
import { useContext } from 'react'
import { Dropdown } from 'react-bootstrap'
import { fetchDevices } from '../http/deviceApi'
import { Context } from '../main'
import { Filter } from '../store/types'
import { delay } from './spinner'

interface Props {
    setLoading: ( value: boolean ) => void
}

const SortDropdown: React.FC<Props> = observer(({ setLoading }) => {
    const { device } = useContext( Context )
    const options: Filter[] = [
        { key: 'price', order: 'DESC' },
        { key: 'price', order: 'ASC' },
        { key: 'rating', order: 'DESC' },
        { key: 'rating', order: 'ASC' },
        { key: 'name', order: 'ASC' },
        { key: 'name', order: 'DESC' },
    ]

    const setNewFilter = ( option: Filter ) => {
        setLoading( true )
        fetchDevices( device.selectedType.id, device.selectedBrand.id, device.page, device.limit, option )
        .then(({ devices: { rows, count }}) => {
                device.setFilter( option )
                device.setTotalCount( count )
                device.setDevices( rows )
        }).catch(( e: Error ) => console.error( e ))
        .finally(() => {
            delay(() => setLoading( false ))
        })
    }

    return <Dropdown>
        <Dropdown.Toggle
            variant='outline-secondary'
            style={{ width: '100%' }}>
            { device.filter?.key
                && ( device.filter?.key + ' ' + ( device.filter?.order === 'ASC' ? 'down-up' : 'up-down' ))
                || 'Sort by:' }
        </Dropdown.Toggle>
        <div>
            <Dropdown.Menu style={{ width: '100%' }}>
                { options.map(( o ) => {
                    if ( o.key !== 'name' ) {
                        return <Dropdown.Item
                            key={ o.key + ' ' + ( o.order === 'ASC' ? 'down-up' : 'up-down' )}
                            onClick={() => { setNewFilter( o )}}>
                                { o.key + ' ' + ( o.order === 'ASC' ? 'down-up' : 'up-down' )}
                        </Dropdown.Item>
                    }
                    return <Dropdown.Item
                        key={ o.key + ' ' + ( o.order === 'ASC' ? 'up-down' : 'down-up' )}
                        onClick={() => { setNewFilter( o )}}>
                            { o.key + ' ' + ( o.order === 'ASC' ? 'up-down' : 'down-up' )}
                    </Dropdown.Item>
                }) }
            </Dropdown.Menu>
        </div>
    </Dropdown>
})

export default SortDropdown