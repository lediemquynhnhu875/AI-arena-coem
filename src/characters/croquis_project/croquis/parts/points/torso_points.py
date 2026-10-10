"""Duong vien ngoai than (nua trai) tu co xuong hong. Sua o day de doi dang than.
So do tu anh tham khao (1 dau = 84px): vai ~+-57, nguc ~+-45, eo ~+-34, hong ~+-58."""
TORSO_OUTER = [
    (-12.5, 122), (-12, 136),                  # 0-1  co (duoi cam), rong ~25px = 0.3 dau
    (-13.5, 148), (-20, 155),                  # 2-3  co loe nhe vao co thang
    (-30, 159), (-45, 162), (-55, 165.5),      # 4-6  co thang -> dau vai (khop voi tay)
    (-58, 177), (-50, 196), (-48, 215), (-44, 234),    # 7-10 nach (nam trong tay) -> vong 1
    (-40, 248), (-36, 270), (-34, 291),    # 9-11 duoi nguc -> eo
    (-41, 312), (-51, 334), (-57, 351),    # 12-14 eo loe ra hong tron
    (-58, 367), (-56, 389), (-54, 410),    # 15-17 hong rong nhat -> dui tren (day chau o y~402)
]
