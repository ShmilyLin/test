<template>
    <div class="hotel-card">
        <div class="hotel-card-info">
			<div class="hotel-card-info-name">{{cardDetail.name}}</div>
			<div class="hotel-card-info-type">{{cardDetail.type}}</div>
			<div class="hotel-card-info-tags" v-if="cardDetail.tags && cardDetail.tags.length > 0">
				<!-- <div class="hotel-card-info-tags-item" v-for="hotelCardTagItem in cardDetail.tags">{{hotelCardTagItem}}</div> -->
			</div>
			<div class="hotel-card-info-address">
				<div class="hotel-card-info-address-icon"></div>
				<div class="hotel-card-info-address-content">{{addressContent}}</div>
			</div>
			<div class="hotel-card-info-edit" title="编辑住宿卡"></div>
		</div>
		<div class="hotel-card-rooms">
			<div class="hotel-card-rooms-header">
				<div class="hotel-card-rooms-header-title">房型</div>
				<div class="hotel-card-rooms-header-show" 
					title="显示所有房型" 
					@mousedown.stop 
					@mouseup.stop
					@click.stop="sectionRightHotelCardItemShowButtonClickEvent">{{cardDetail.isShowRooms ? '收起' : '展开'}}</div>
			</div>
			<ul class="hotel-card-rooms-list" v-if="cardDetail.isShowRooms">
				<li class="hotel-card-rooms-list-item" 
					v-for="(roomItem, roomIndex) in cardDetail.rooms" 
					:key="'hotel_card_item_' + cardDetail._id + '_room_' + roomItem.id">
					<div class="hotel-card-rooms-list-item-info">
						<div class="hotel-card-rooms-list-item-info-name">{{roomItem.roomType}}</div>
						<div :class="roomItem.isShow ? 'hotel-card-rooms-list-item-info-more-show' : 'hotel-card-rooms-list-item-info-more'" 
							title="更多信息" 
							@mousedown.stop 
							@mouseup.stop
							@click.stop="sectionRightHotelCardItemRoomItemShowButtonClickEvent(roomIndex)"></div>
					</div>
					<div class="hotel-card-rooms-list-item-more" v-if="roomItem.isShow">
						<div class="hotel-card-rooms-list-item-more-text">房间大小: {{roomItem.squareMeter}}㎡</div>
						<div class="hotel-card-rooms-list-item-more-text">可住人数: {{roomItem.numberOfPeopleAvailable.adult}}名成年人{{roomItem.numberOfPeopleAvailable.child > 0 ? '， ' + roomItem.numberOfPeopleAvailable.child + '名儿童' : ''}}{{roomItem.numberOfPeopleAvailable.canExtraBed ? '（可加床）' : '（不可加床）'}}</div>
						<div class="hotel-card-rooms-list-item-more-text">床型说明: {{roomItem.bedType}}</div>
						<div class="hotel-card-rooms-list-item-more-text">房间窗户: {{roomItem.windowTyps}}</div>
						<div class="hotel-card-rooms-list-item-more-text">{{roomItem.nonsmoking ? '房间禁烟' : '房间可以吸烟'}}</div>
						<div class="hotel-card-rooms-list-item-more-text" v-if="roomItem.roomDesc && roomItem.roomDesc.length > 0">房间说明: {{roomItem.roomDesc}}</div>
					</div>
				</li>
			</ul>
		</div>
    </div>
</template>

<script>

export default {
	name: 'HotelCard',
	props: {
		cardInfo: {
			type: Object,
			required: true,
        },
        cardIndex: {
            type: Number,
            default: -1
        }
	},
	data() {
		return {
			cardDetail: null,
		}
    },
    computed: {
        addressContent: function () {
            var tempContent = "";
            if (this.cardInfo.address.country && this.cardInfo.address.country.length > 0) {
                tempContent += this.cardInfo.address.country + " ";
            }

            if (this.cardInfo.address.province && this.cardInfo.address.province.length > 0 && this.cardInfo.address.province !== this.cardInfo.address.city) {
                tempContent += this.cardInfo.address.province;
            }

            if (this.cardInfo.address.city && this.cardInfo.address.city.length > 0) {
                tempContent += this.cardInfo.address.city;
            }

            if (this.cardInfo.address.district && this.cardInfo.address.district.length > 0) {
                tempContent += this.cardInfo.address.district;
            }
            
            if (this.cardInfo.address.content && this.cardInfo.address.content.length > 0) {
                tempContent += this.cardInfo.address.content;
            }

            return tempContent;
        }
    },
	watch: {
		'cardInfo': {
			handler: 'watchCardInfoChangeEvent',
			deep: true,
		}
	},
	created: function () {
		this.watchCardInfoChangeEvent();
	},
	methods: {
		watchCardInfoChangeEvent: function () {
			var tempCard = JSON.parse(JSON.stringify(this.cardInfo));
			tempCard.isShowRooms = false;
			if (tempCard.rooms) {
				for (var i = 0; i < tempCard.rooms.length; i++) {
					tempCard.rooms[i].isShow = false;
				}
			}

			this.cardDetail = tempCard;
		},

		/**
         * 点击显示一个住宿卡的所有房型
         */
        sectionRightHotelCardItemShowButtonClickEvent: function () {
            this.cardDetail.isShowRooms = !this.cardDetail.isShowRooms;
        },

        /**
         * 点击显示一个房型的详细信息
         */
        sectionRightHotelCardItemRoomItemShowButtonClickEvent: function (roomIndex) {
            var tempRoomItem = this.cardDetail.rooms[roomIndex];
            tempRoomItem.isShow = !tempRoomItem.isShow;
            this.$set(this.cardDetail.rooms, roomIndex, tempRoomItem);
        },
	}
}
</script>

<style lang="scss" scoped>
.hotel-card {
    padding: 5px 10px;
    /* border-bottom: 1px solid lightgray; */
    background-color: white;
    margin-bottom: 5px;
}

.hotel-card-info {
    width: 100%;
}

.hotel-card-info-name {
    width: calc(100% - 20px);
    font-size: 18px;
    font-weight: 500;
    line-height: 1.5;
}

.hotel-card-info-type {
    font-size: 12px;
    font-weight: 300;
    color: dodgerblue;
    line-height: 1.5;
    margin-top: 3px;
}

.hotel-card-info-tags {
    width: calc(100% + 4px);
    margin-right: -2px;
    margin-top: 4px;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.hotel-card-info-tags-item {
    margin: 2px;
    padding: 2px 4px;
    border: 1px solid lightgray;
    text-align: center;
    line-height: 1;
    font-size: 12px;
    color: lightgray;
    width: max-content;
    border-radius: 2px;
}

.hotel-card-info-address {
    width: 100%;
    display: flex;
    flex-direction: row;
    margin-top: 5px;
}

.hotel-card-info-address-icon {
    width: 18px;
    height: 18px;
    background-image: url(../assets/address_icon.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
}

.hotel-card-info-address-content {
    width: calc(100% - 22px);
    margin-left: 4px;
    font-size: 12px;
    font-weight: 300;
    color: #888888;
    line-height: 1.5;
}

.hotel-card-info-edit {
    position: absolute;
    width: 16px;
    height: 16px;
    background-image: url(../assets/right_sidebar_edit.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
    top: 4px;
    right: 0px;
}

.hotel-card-info-edit:hover {
    background-image: url(../assets/right_sidebar_edit_hover.png);
}

.hotel-card-rooms {
    width: 100%;
    margin-top: 5px;
    border-top: 1px solid lightgray;
    padding-top: 4px;
}

.hotel-card-rooms-header {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

.hotel-card-rooms-header-title {
    font-size: 14px;
    color: #555555;
    line-height: 1.5;
}

.hotel-card-rooms-header-show {
    font-size: 12px;
    font-weight: 300;
    color: dodgerblue;
    line-height: 1.5;
    cursor: pointer;
}

.hotel-card-rooms-list {
    width: calc(100% - 15px);
    margin-left: 15px;
}

.hotel-card-rooms-list-item {
    width: 100%;
    border-bottom: 1px solid lightgray;
}

.hotel-card-rooms-list-item-info {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 5px 0;
}

.hotel-card-rooms-list-item-info-name {
    font-size: 11px;
    font-weight: 300;
    line-height: 1.5;
    color: #666666;
}

.hotel-card-rooms-list-item-info-more {
    cursor: pointer;
    width: 14px;
    height: 14px;
    background-image: url(../../../assets/hidden_999999.png);
    background-repeat: no-repeat;
    background-size: 100%;
    cursor: pointer;
}

.hotel-card-rooms-list-item-info-more-show {
    cursor: pointer;
    width: 14px;
    height: 14px;
    background-image: url(../../../assets/show_999999.png);
    background-repeat: no-repeat;
    background-size: 100%;
    cursor: pointer;
}

.hotel-card-rooms-list-item-more {
    width: calc(100% - 30px);
    margin-left: 15px;
}

.hotel-card-rooms-list-item-more-text {
    font-size: 12px;
    font-weight: 300;
    color: #777777;
    line-height: 1.5;
}
</style>