/**
 * GENERATED FILE -- DO NOT EDIT BY HAND.
 *
 * Produced by scripts/generate-world.ts. To change the simulated world, edit
 * that script and re-run:  npm run gen:world --workspace @soc/server
 *
 * This file is committed on purpose: exercise answers depend on the exact
 * contents, so the logs must not change unless somebody intends them to.
 */

/** 2539 lines of authentication events for Aug 15. */
export const AUTH_LOG = `Aug 15 00:00:29 rmg-web-02 sshd[21426]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 00:00:31 rmg-web-02 sshd[21426]: Failed password for nagios from 10.20.9.40 port 40008 ssh2
Aug 15 00:05:19 rmg-web-02 sshd[21429]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 00:05:21 rmg-web-02 sshd[21429]: Failed password for nagios from 10.20.9.40 port 55036 ssh2
Aug 15 00:10:18 rmg-web-02 sshd[21438]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 00:10:20 rmg-web-02 sshd[21438]: Failed password for nagios from 10.20.9.40 port 37675 ssh2
Aug 15 00:11:21 rmg-web-02 sshd[22872]: Invalid user admin from 198.51.100.202 port 52392
Aug 15 00:11:22 rmg-web-02 sshd[22872]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 00:11:22 rmg-web-02 sshd[22872]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 00:11:24 rmg-web-02 sshd[22872]: Failed password for invalid user admin from 198.51.100.202 port 52392 ssh2
Aug 15 00:11:25 rmg-web-02 sshd[22872]: Connection closed by invalid user admin 198.51.100.202 port 52392 [preauth]
Aug 15 00:15:14 rmg-web-02 sshd[21447]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 00:15:16 rmg-web-02 sshd[21447]: Failed password for nagios from 10.20.9.40 port 42985 ssh2
Aug 15 00:15:51 rmg-web-02 sshd[22880]: Invalid user webmaster from 203.0.113.12 port 39904
Aug 15 00:15:52 rmg-web-02 sshd[22880]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 00:15:52 rmg-web-02 sshd[22880]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 00:15:54 rmg-web-02 sshd[22880]: Failed password for invalid user webmaster from 203.0.113.12 port 39904 ssh2
Aug 15 00:15:55 rmg-web-02 sshd[22880]: Connection closed by invalid user webmaster 203.0.113.12 port 39904 [preauth]
Aug 15 00:16:18 rmg-web-02 sshd[22896]: Invalid user support from 198.51.100.23 port 36431
Aug 15 00:16:19 rmg-web-02 sshd[22896]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 00:16:19 rmg-web-02 sshd[22896]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Aug 15 00:16:21 rmg-web-02 sshd[22896]: Failed password for invalid user support from 198.51.100.23 port 36431 ssh2
Aug 15 00:16:22 rmg-web-02 sshd[22896]: Connection closed by invalid user support 198.51.100.23 port 36431 [preauth]
Aug 15 00:17:01 rmg-web-02 CRON[29736]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 00:17:01 rmg-web-02 CRON[9070]: pam_unix(cron:session): session closed for user root
Aug 15 00:20:27 rmg-web-02 sshd[21451]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 00:20:29 rmg-web-02 sshd[21451]: Failed password for nagios from 10.20.9.40 port 55700 ssh2
Aug 15 00:25:30 rmg-web-02 sshd[21456]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 00:25:32 rmg-web-02 sshd[21456]: Failed password for nagios from 10.20.9.40 port 59880 ssh2
Aug 15 00:29:45 rmg-web-02 sshd[22889]: Invalid user user from 203.0.113.140 port 46679
Aug 15 00:29:46 rmg-web-02 sshd[22889]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 00:29:46 rmg-web-02 sshd[22889]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Aug 15 00:29:48 rmg-web-02 sshd[22889]: Failed password for invalid user user from 203.0.113.140 port 46679 ssh2
Aug 15 00:29:49 rmg-web-02 sshd[22889]: Connection closed by invalid user user 203.0.113.140 port 46679 [preauth]
Aug 15 00:30:02 rmg-web-02 sshd[21462]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 00:30:04 rmg-web-02 sshd[21462]: Failed password for nagios from 10.20.9.40 port 37894 ssh2
Aug 15 00:35:16 rmg-web-02 sshd[21463]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 00:35:18 rmg-web-02 sshd[21463]: Failed password for nagios from 10.20.9.40 port 56467 ssh2
Aug 15 00:35:57 rmg-web-02 sshd[22886]: Invalid user admin from 198.51.100.202 port 51188
Aug 15 00:35:58 rmg-web-02 sshd[22886]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 00:35:58 rmg-web-02 sshd[22886]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 00:36:00 rmg-web-02 sshd[22886]: Failed password for invalid user admin from 198.51.100.202 port 51188 ssh2
Aug 15 00:36:01 rmg-web-02 sshd[22886]: Connection closed by invalid user admin 198.51.100.202 port 51188 [preauth]
Aug 15 00:40:24 rmg-web-02 sshd[21464]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 00:40:26 rmg-web-02 sshd[21464]: Failed password for nagios from 10.20.9.40 port 37697 ssh2
Aug 15 00:45:05 rmg-web-02 sshd[21472]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 00:45:07 rmg-web-02 sshd[21472]: Failed password for nagios from 10.20.9.40 port 46075 ssh2
Aug 15 00:50:22 rmg-web-02 sshd[21473]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 00:50:24 rmg-web-02 sshd[21473]: Failed password for nagios from 10.20.9.40 port 38517 ssh2
Aug 15 00:55:12 rmg-web-02 sshd[21475]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 00:55:14 rmg-web-02 sshd[21475]: Failed password for nagios from 10.20.9.40 port 35305 ssh2
Aug 15 00:56:56 rmg-web-02 sshd[22904]: Invalid user pi from 198.51.100.202 port 53020
Aug 15 00:56:57 rmg-web-02 sshd[22904]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 00:56:57 rmg-web-02 sshd[22904]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 00:56:59 rmg-web-02 sshd[22904]: Failed password for invalid user pi from 198.51.100.202 port 53020 ssh2
Aug 15 00:57:00 rmg-web-02 sshd[22904]: Connection closed by invalid user pi 198.51.100.202 port 53020 [preauth]
Aug 15 01:00:00 rmg-web-02 sshd[21476]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 01:00:02 rmg-web-02 sshd[21476]: Failed password for nagios from 10.20.9.40 port 36951 ssh2
Aug 15 01:05:21 rmg-web-02 sshd[21479]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 01:05:23 rmg-web-02 sshd[21479]: Failed password for nagios from 10.20.9.40 port 54013 ssh2
Aug 15 01:10:15 rmg-web-02 sshd[21487]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 01:10:17 rmg-web-02 sshd[21487]: Failed password for nagios from 10.20.9.40 port 56992 ssh2
Aug 15 01:15:19 rmg-web-02 sshd[21496]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 01:15:21 rmg-web-02 sshd[21496]: Failed password for nagios from 10.20.9.40 port 49776 ssh2
Aug 15 01:17:01 rmg-web-02 CRON[23043]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 01:17:01 rmg-web-02 CRON[11876]: pam_unix(cron:session): session closed for user root
Aug 15 01:20:16 rmg-web-02 sshd[21504]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 01:20:18 rmg-web-02 sshd[21504]: Failed password for nagios from 10.20.9.40 port 43633 ssh2
Aug 15 01:25:21 rmg-web-02 sshd[21509]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 01:25:23 rmg-web-02 sshd[21509]: Failed password for nagios from 10.20.9.40 port 64111 ssh2
Aug 15 01:25:49 rmg-web-02 sshd[22920]: Invalid user jenkins from 192.0.2.171 port 32465
Aug 15 01:25:50 rmg-web-02 sshd[22920]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 01:25:50 rmg-web-02 sshd[22920]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Aug 15 01:25:52 rmg-web-02 sshd[22920]: Failed password for invalid user jenkins from 192.0.2.171 port 32465 ssh2
Aug 15 01:25:53 rmg-web-02 sshd[22920]: Connection closed by invalid user jenkins 192.0.2.171 port 32465 [preauth]
Aug 15 01:30:16 rmg-web-02 sshd[21408]: Accepted publickey for svc-backup from 10.20.9.15 port 32732 ssh2
Aug 15 01:30:17 rmg-web-02 sshd[21408]: pam_unix(sshd:session): session opened for user svc-backup(uid=1500) by (uid=0)
Aug 15 01:30:28 rmg-web-02 sshd[21510]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 01:30:30 rmg-web-02 sshd[21510]: Failed password for nagios from 10.20.9.40 port 60941 ssh2
Aug 15 01:34:37 rmg-web-02 sshd[21408]: pam_unix(sshd:session): session closed for user svc-backup
Aug 15 01:35:28 rmg-web-02 sshd[21511]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 01:35:30 rmg-web-02 sshd[21511]: Failed password for nagios from 10.20.9.40 port 52181 ssh2
Aug 15 01:40:22 rmg-web-02 sshd[21514]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 01:40:24 rmg-web-02 sshd[21514]: Failed password for nagios from 10.20.9.40 port 60178 ssh2
Aug 15 01:44:08 rmg-web-02 sshd[22921]: Invalid user deploy from 203.0.113.140 port 54744
Aug 15 01:44:09 rmg-web-02 sshd[22921]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 01:44:09 rmg-web-02 sshd[22921]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Aug 15 01:44:11 rmg-web-02 sshd[22921]: Failed password for invalid user deploy from 203.0.113.140 port 54744 ssh2
Aug 15 01:44:12 rmg-web-02 sshd[22921]: Connection closed by invalid user deploy 203.0.113.140 port 54744 [preauth]
Aug 15 01:45:08 rmg-web-02 sshd[21521]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 01:45:10 rmg-web-02 sshd[21521]: Failed password for nagios from 10.20.9.40 port 46273 ssh2
Aug 15 01:50:22 rmg-web-02 sshd[21530]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 01:50:24 rmg-web-02 sshd[21530]: Failed password for nagios from 10.20.9.40 port 33936 ssh2
Aug 15 01:55:03 rmg-web-02 sshd[21533]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 01:55:05 rmg-web-02 sshd[21533]: Failed password for nagios from 10.20.9.40 port 35949 ssh2
Aug 15 01:58:44 rmg-web-02 sshd[22913]: Invalid user postgres from 192.0.2.44 port 32546
Aug 15 01:58:45 rmg-web-02 sshd[22913]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 01:58:45 rmg-web-02 sshd[22913]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 01:58:47 rmg-web-02 sshd[22913]: Failed password for invalid user postgres from 192.0.2.44 port 32546 ssh2
Aug 15 01:58:48 rmg-web-02 sshd[22913]: Connection closed by invalid user postgres 192.0.2.44 port 32546 [preauth]
Aug 15 01:59:54 rmg-web-02 sshd[22924]: Invalid user ftpuser from 203.0.113.201 port 48921
Aug 15 01:59:55 rmg-web-02 sshd[22924]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 01:59:55 rmg-web-02 sshd[22924]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Aug 15 01:59:57 rmg-web-02 sshd[22924]: Failed password for invalid user ftpuser from 203.0.113.201 port 48921 ssh2
Aug 15 01:59:58 rmg-web-02 sshd[22924]: Connection closed by invalid user ftpuser 203.0.113.201 port 48921 [preauth]
Aug 15 02:00:19 rmg-web-02 sshd[21539]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 02:00:21 rmg-web-02 sshd[21539]: Failed password for nagios from 10.20.9.40 port 62756 ssh2
Aug 15 02:05:16 rmg-web-02 sshd[21546]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 02:05:18 rmg-web-02 sshd[21546]: Failed password for nagios from 10.20.9.40 port 44635 ssh2
Aug 15 02:10:23 rmg-web-02 sshd[21551]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 02:10:25 rmg-web-02 sshd[21551]: Failed password for nagios from 10.20.9.40 port 63809 ssh2
Aug 15 02:14:44 rmg-web-02 sshd[22937]: Invalid user ftpuser from 192.0.2.9 port 39882
Aug 15 02:14:45 rmg-web-02 sshd[22937]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 02:14:45 rmg-web-02 sshd[22937]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.9
Aug 15 02:14:47 rmg-web-02 sshd[22937]: Failed password for invalid user ftpuser from 192.0.2.9 port 39882 ssh2
Aug 15 02:14:48 rmg-web-02 sshd[22937]: Connection closed by invalid user ftpuser 192.0.2.9 port 39882 [preauth]
Aug 15 02:15:12 rmg-web-02 sshd[21553]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 02:15:14 rmg-web-02 sshd[21553]: Failed password for nagios from 10.20.9.40 port 58412 ssh2
Aug 15 02:17:01 rmg-web-02 CRON[10662]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 02:17:01 rmg-web-02 CRON[9919]: pam_unix(cron:session): session closed for user root
Aug 15 02:17:34 rmg-web-02 sshd[22967]: Invalid user jenkins from 198.51.100.202 port 55228
Aug 15 02:17:35 rmg-web-02 sshd[22967]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 02:17:35 rmg-web-02 sshd[22967]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 02:17:37 rmg-web-02 sshd[22967]: Failed password for invalid user jenkins from 198.51.100.202 port 55228 ssh2
Aug 15 02:17:38 rmg-web-02 sshd[22967]: Connection closed by invalid user jenkins 198.51.100.202 port 55228 [preauth]
Aug 15 02:20:11 rmg-web-02 sshd[21558]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 02:20:13 rmg-web-02 sshd[21558]: Failed password for nagios from 10.20.9.40 port 52294 ssh2
Aug 15 02:25:24 rmg-web-02 sshd[21563]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 02:25:26 rmg-web-02 sshd[21563]: Failed password for nagios from 10.20.9.40 port 59780 ssh2
Aug 15 02:30:05 rmg-web-02 sshd[21570]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 02:30:07 rmg-web-02 sshd[21570]: Failed password for nagios from 10.20.9.40 port 42175 ssh2
Aug 15 02:32:23 rmg-web-02 sshd[22930]: Invalid user pi from 198.51.100.23 port 56851
Aug 15 02:32:24 rmg-web-02 sshd[22930]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 02:32:24 rmg-web-02 sshd[22930]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Aug 15 02:32:26 rmg-web-02 sshd[22930]: Failed password for invalid user pi from 198.51.100.23 port 56851 ssh2
Aug 15 02:32:27 rmg-web-02 sshd[22930]: Connection closed by invalid user pi 198.51.100.23 port 56851 [preauth]
Aug 15 02:35:20 rmg-web-02 sshd[21579]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 02:35:22 rmg-web-02 sshd[21579]: Failed password for nagios from 10.20.9.40 port 46251 ssh2
Aug 15 02:40:10 rmg-web-02 sshd[21583]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 02:40:12 rmg-web-02 sshd[21583]: Failed password for nagios from 10.20.9.40 port 37704 ssh2
Aug 15 02:45:04 rmg-web-02 sshd[21591]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 02:45:06 rmg-web-02 sshd[21591]: Failed password for nagios from 10.20.9.40 port 55776 ssh2
Aug 15 02:46:18 rmg-web-02 sshd[22960]: Invalid user oracle from 198.51.100.23 port 61468
Aug 15 02:46:19 rmg-web-02 sshd[22960]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 02:46:19 rmg-web-02 sshd[22960]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Aug 15 02:46:21 rmg-web-02 sshd[22960]: Failed password for invalid user oracle from 198.51.100.23 port 61468 ssh2
Aug 15 02:46:22 rmg-web-02 sshd[22960]: Connection closed by invalid user oracle 198.51.100.23 port 61468 [preauth]
Aug 15 02:50:25 rmg-web-02 sshd[21595]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 02:50:27 rmg-web-02 sshd[21595]: Failed password for nagios from 10.20.9.40 port 55852 ssh2
Aug 15 02:50:41 rmg-web-02 sshd[22955]: Invalid user postgres from 198.51.100.202 port 54744
Aug 15 02:50:42 rmg-web-02 sshd[22955]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 02:50:42 rmg-web-02 sshd[22955]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 02:50:44 rmg-web-02 sshd[22955]: Failed password for invalid user postgres from 198.51.100.202 port 54744 ssh2
Aug 15 02:50:45 rmg-web-02 sshd[22955]: Connection closed by invalid user postgres 198.51.100.202 port 54744 [preauth]
Aug 15 02:55:00 rmg-web-02 sshd[21598]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 02:55:02 rmg-web-02 sshd[21598]: Failed password for nagios from 10.20.9.40 port 44312 ssh2
Aug 15 02:56:02 rmg-web-02 sshd[22946]: Invalid user mysql from 203.0.113.12 port 48624
Aug 15 02:56:03 rmg-web-02 sshd[22946]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 02:56:03 rmg-web-02 sshd[22946]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 02:56:05 rmg-web-02 sshd[22946]: Failed password for invalid user mysql from 203.0.113.12 port 48624 ssh2
Aug 15 02:56:06 rmg-web-02 sshd[22946]: Connection closed by invalid user mysql 203.0.113.12 port 48624 [preauth]
Aug 15 03:00:28 rmg-web-02 sshd[21599]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 03:00:30 rmg-web-02 sshd[21599]: Failed password for nagios from 10.20.9.40 port 44072 ssh2
Aug 15 03:05:30 rmg-web-02 sshd[21606]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 03:05:32 rmg-web-02 sshd[21606]: Failed password for nagios from 10.20.9.40 port 58601 ssh2
Aug 15 03:10:12 rmg-web-02 sshd[21611]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 03:10:14 rmg-web-02 sshd[21611]: Failed password for nagios from 10.20.9.40 port 52173 ssh2
Aug 15 03:11:27 rmg-web-02 sshd[21417]: Accepted password for rchen from 10.20.4.12 port 32074 ssh2
Aug 15 03:11:28 rmg-web-02 sshd[21417]: pam_unix(sshd:session): session opened for user rchen(uid=1003) by (uid=0)
Aug 15 03:14:02 rmg-web-02 sudo:    rchen : TTY=pts/0 ; PWD=/home/rchen ; USER=root ; COMMAND=/usr/bin/systemctl restart postgresql
Aug 15 03:14:02 rmg-web-02 sudo: pam_unix(sudo:session): session opened for user root(uid=0) by rchen(uid=1003)
Aug 15 03:14:09 rmg-web-02 sudo: pam_unix(sudo:session): session closed for user root
Aug 15 03:15:11 rmg-web-02 sshd[22986]: Invalid user user from 192.0.2.44 port 58934
Aug 15 03:15:12 rmg-web-02 sshd[22986]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 03:15:12 rmg-web-02 sshd[22986]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 03:15:14 rmg-web-02 sshd[22986]: Failed password for invalid user user from 192.0.2.44 port 58934 ssh2
Aug 15 03:15:15 rmg-web-02 sshd[22986]: Connection closed by invalid user user 192.0.2.44 port 58934 [preauth]
Aug 15 03:15:27 rmg-web-02 sshd[21618]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 03:15:29 rmg-web-02 sshd[21618]: Failed password for nagios from 10.20.9.40 port 41665 ssh2
Aug 15 03:17:01 rmg-web-02 CRON[14656]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 03:17:01 rmg-web-02 CRON[29362]: pam_unix(cron:session): session closed for user root
Aug 15 03:18:40 rmg-web-02 sshd[22979]: Invalid user webmaster from 192.0.2.171 port 63588
Aug 15 03:18:41 rmg-web-02 sshd[22979]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 03:18:41 rmg-web-02 sshd[22979]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Aug 15 03:18:43 rmg-web-02 sshd[22979]: Failed password for invalid user webmaster from 192.0.2.171 port 63588 ssh2
Aug 15 03:18:44 rmg-web-02 sshd[22979]: Connection closed by invalid user webmaster 192.0.2.171 port 63588 [preauth]
Aug 15 03:20:08 rmg-web-02 sshd[21626]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 03:20:10 rmg-web-02 sshd[21626]: Failed password for nagios from 10.20.9.40 port 39316 ssh2
Aug 15 03:25:01 rmg-web-02 sshd[21627]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 03:25:03 rmg-web-02 sshd[21627]: Failed password for nagios from 10.20.9.40 port 60770 ssh2
Aug 15 03:30:24 rmg-web-02 sshd[22972]: Invalid user webmaster from 198.51.100.23 port 30352
Aug 15 03:30:25 rmg-web-02 sshd[22972]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 03:30:25 rmg-web-02 sshd[22972]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Aug 15 03:30:27 rmg-web-02 sshd[22972]: Failed password for invalid user webmaster from 198.51.100.23 port 30352 ssh2
Aug 15 03:30:28 rmg-web-02 sshd[22972]: Connection closed by invalid user webmaster 198.51.100.23 port 30352 [preauth]
Aug 15 03:30:30 rmg-web-02 sshd[21629]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 03:30:32 rmg-web-02 sshd[21629]: Failed password for nagios from 10.20.9.40 port 46379 ssh2
Aug 15 03:32:15 rmg-web-02 sshd[22969]: Invalid user ubuntu from 203.0.113.140 port 58472
Aug 15 03:32:16 rmg-web-02 sshd[22969]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 03:32:16 rmg-web-02 sshd[22969]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Aug 15 03:32:18 rmg-web-02 sshd[22969]: Failed password for invalid user ubuntu from 203.0.113.140 port 58472 ssh2
Aug 15 03:32:19 rmg-web-02 sshd[22969]: Connection closed by invalid user ubuntu 203.0.113.140 port 58472 [preauth]
Aug 15 03:35:25 rmg-web-02 sshd[21634]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 03:35:27 rmg-web-02 sshd[21634]: Failed password for nagios from 10.20.9.40 port 51426 ssh2
Aug 15 03:38:01 rmg-web-02 sshd[22995]: Invalid user webmaster from 198.51.100.202 port 60294
Aug 15 03:38:02 rmg-web-02 sshd[22995]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 03:38:02 rmg-web-02 sshd[22995]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 03:38:04 rmg-web-02 sshd[22995]: Failed password for invalid user webmaster from 198.51.100.202 port 60294 ssh2
Aug 15 03:38:05 rmg-web-02 sshd[22995]: Connection closed by invalid user webmaster 198.51.100.202 port 60294 [preauth]
Aug 15 03:40:28 rmg-web-02 sshd[21642]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 03:40:30 rmg-web-02 sshd[21642]: Failed password for nagios from 10.20.9.40 port 59182 ssh2
Aug 15 03:41:18 rmg-web-02 sshd[21417]: pam_unix(sshd:session): session closed for user rchen
Aug 15 03:45:10 rmg-web-02 sshd[21647]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 03:45:12 rmg-web-02 sshd[21647]: Failed password for nagios from 10.20.9.40 port 39168 ssh2
Aug 15 03:50:28 rmg-web-02 sshd[21649]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 03:50:30 rmg-web-02 sshd[21649]: Failed password for nagios from 10.20.9.40 port 61402 ssh2
Aug 15 03:55:14 rmg-web-02 sshd[21651]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 03:55:16 rmg-web-02 sshd[21651]: Failed password for nagios from 10.20.9.40 port 31050 ssh2
Aug 15 03:57:22 rmg-web-02 sshd[22983]: Invalid user postgres from 203.0.113.201 port 31334
Aug 15 03:57:23 rmg-web-02 sshd[22983]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 03:57:23 rmg-web-02 sshd[22983]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Aug 15 03:57:25 rmg-web-02 sshd[22983]: Failed password for invalid user postgres from 203.0.113.201 port 31334 ssh2
Aug 15 03:57:26 rmg-web-02 sshd[22983]: Connection closed by invalid user postgres 203.0.113.201 port 31334 [preauth]
Aug 15 04:00:28 rmg-web-02 sshd[21655]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 04:00:30 rmg-web-02 sshd[21655]: Failed password for nagios from 10.20.9.40 port 52064 ssh2
Aug 15 04:05:01 rmg-web-02 sshd[21657]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 04:05:03 rmg-web-02 sshd[21657]: Failed password for nagios from 10.20.9.40 port 35659 ssh2
Aug 15 04:08:07 rmg-web-02 sshd[23013]: Invalid user guest from 203.0.113.12 port 37855
Aug 15 04:08:08 rmg-web-02 sshd[23013]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 04:08:08 rmg-web-02 sshd[23013]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 04:08:10 rmg-web-02 sshd[23013]: Failed password for invalid user guest from 203.0.113.12 port 37855 ssh2
Aug 15 04:08:11 rmg-web-02 sshd[23013]: Connection closed by invalid user guest 203.0.113.12 port 37855 [preauth]
Aug 15 04:10:06 rmg-web-02 sshd[21664]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 04:10:08 rmg-web-02 sshd[21664]: Failed password for nagios from 10.20.9.40 port 45169 ssh2
Aug 15 04:15:06 rmg-web-02 sshd[21672]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 04:15:08 rmg-web-02 sshd[21672]: Failed password for nagios from 10.20.9.40 port 61978 ssh2
Aug 15 04:17:01 rmg-web-02 CRON[28258]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 04:17:01 rmg-web-02 CRON[25804]: pam_unix(cron:session): session closed for user root
Aug 15 04:20:28 rmg-web-02 sshd[21673]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 04:20:30 rmg-web-02 sshd[21673]: Failed password for nagios from 10.20.9.40 port 30607 ssh2
Aug 15 04:25:27 rmg-web-02 sshd[21679]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 04:25:29 rmg-web-02 sshd[21679]: Failed password for nagios from 10.20.9.40 port 55984 ssh2
Aug 15 04:30:12 rmg-web-02 sshd[21687]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 04:30:14 rmg-web-02 sshd[21687]: Failed password for nagios from 10.20.9.40 port 56068 ssh2
Aug 15 04:32:44 rmg-web-02 sshd[22998]: Invalid user support from 203.0.113.12 port 31319
Aug 15 04:32:45 rmg-web-02 sshd[22998]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 04:32:45 rmg-web-02 sshd[22998]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 04:32:47 rmg-web-02 sshd[22998]: Failed password for invalid user support from 203.0.113.12 port 31319 ssh2
Aug 15 04:32:48 rmg-web-02 sshd[22998]: Connection closed by invalid user support 203.0.113.12 port 31319 [preauth]
Aug 15 04:35:09 rmg-web-02 sshd[21693]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 04:35:11 rmg-web-02 sshd[21693]: Failed password for nagios from 10.20.9.40 port 44815 ssh2
Aug 15 04:38:12 rmg-web-02 sshd[23017]: Invalid user oracle from 198.51.100.202 port 48489
Aug 15 04:38:13 rmg-web-02 sshd[23017]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 04:38:13 rmg-web-02 sshd[23017]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 04:38:15 rmg-web-02 sshd[23017]: Failed password for invalid user oracle from 198.51.100.202 port 48489 ssh2
Aug 15 04:38:16 rmg-web-02 sshd[23017]: Connection closed by invalid user oracle 198.51.100.202 port 48489 [preauth]
Aug 15 04:40:01 rmg-web-02 sshd[21699]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 04:40:03 rmg-web-02 sshd[21699]: Failed password for nagios from 10.20.9.40 port 44277 ssh2
Aug 15 04:45:17 rmg-web-02 sshd[21708]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 04:45:19 rmg-web-02 sshd[21708]: Failed password for nagios from 10.20.9.40 port 64273 ssh2
Aug 15 04:48:52 rmg-web-02 sshd[23012]: Invalid user jenkins from 192.0.2.44 port 46779
Aug 15 04:48:53 rmg-web-02 sshd[23012]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 04:48:53 rmg-web-02 sshd[23012]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 04:48:55 rmg-web-02 sshd[23012]: Failed password for invalid user jenkins from 192.0.2.44 port 46779 ssh2
Aug 15 04:48:56 rmg-web-02 sshd[23012]: Connection closed by invalid user jenkins 192.0.2.44 port 46779 [preauth]
Aug 15 04:50:28 rmg-web-02 sshd[21713]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 04:50:30 rmg-web-02 sshd[21713]: Failed password for nagios from 10.20.9.40 port 62316 ssh2
Aug 15 04:55:06 rmg-web-02 sshd[21720]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 04:55:08 rmg-web-02 sshd[21720]: Failed password for nagios from 10.20.9.40 port 34599 ssh2
Aug 15 04:59:59 rmg-web-02 sshd[23005]: Invalid user support from 198.51.100.202 port 52875
Aug 15 05:00:00 rmg-web-02 sshd[23005]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 05:00:00 rmg-web-02 sshd[23005]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 05:00:01 rmg-web-02 sshd[21727]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 05:00:02 rmg-web-02 sshd[23005]: Failed password for invalid user support from 198.51.100.202 port 52875 ssh2
Aug 15 05:00:03 rmg-web-02 sshd[21727]: Failed password for nagios from 10.20.9.40 port 47605 ssh2
Aug 15 05:00:03 rmg-web-02 sshd[23005]: Connection closed by invalid user support 198.51.100.202 port 52875 [preauth]
Aug 15 05:04:29 rmg-web-02 sshd[23052]: Invalid user guest from 192.0.2.171 port 63957
Aug 15 05:04:30 rmg-web-02 sshd[23052]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 05:04:30 rmg-web-02 sshd[23052]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Aug 15 05:04:32 rmg-web-02 sshd[23052]: Failed password for invalid user guest from 192.0.2.171 port 63957 ssh2
Aug 15 05:04:33 rmg-web-02 sshd[23052]: Connection closed by invalid user guest 192.0.2.171 port 63957 [preauth]
Aug 15 05:05:08 rmg-web-02 sshd[23023]: Invalid user test from 203.0.113.140 port 46747
Aug 15 05:05:09 rmg-web-02 sshd[23023]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 05:05:09 rmg-web-02 sshd[23023]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Aug 15 05:05:11 rmg-web-02 sshd[23023]: Failed password for invalid user test from 203.0.113.140 port 46747 ssh2
Aug 15 05:05:12 rmg-web-02 sshd[23023]: Connection closed by invalid user test 203.0.113.140 port 46747 [preauth]
Aug 15 05:05:27 rmg-web-02 sshd[21736]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 05:05:29 rmg-web-02 sshd[21736]: Failed password for nagios from 10.20.9.40 port 58563 ssh2
Aug 15 05:10:03 rmg-web-02 sshd[21744]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 05:10:05 rmg-web-02 sshd[21744]: Failed password for nagios from 10.20.9.40 port 56047 ssh2
Aug 15 05:11:37 rmg-web-02 sshd[23034]: Invalid user test from 192.0.2.44 port 49986
Aug 15 05:11:38 rmg-web-02 sshd[23034]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 05:11:38 rmg-web-02 sshd[23034]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 05:11:40 rmg-web-02 sshd[23034]: Failed password for invalid user test from 192.0.2.44 port 49986 ssh2
Aug 15 05:11:41 rmg-web-02 sshd[23034]: Connection closed by invalid user test 192.0.2.44 port 49986 [preauth]
Aug 15 05:11:55 rmg-web-02 sshd[23029]: Invalid user admin from 203.0.113.140 port 48961
Aug 15 05:11:56 rmg-web-02 sshd[23029]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 05:11:56 rmg-web-02 sshd[23029]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Aug 15 05:11:58 rmg-web-02 sshd[23029]: Failed password for invalid user admin from 203.0.113.140 port 48961 ssh2
Aug 15 05:11:59 rmg-web-02 sshd[23029]: Connection closed by invalid user admin 203.0.113.140 port 48961 [preauth]
Aug 15 05:15:09 rmg-web-02 sshd[21747]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 05:15:11 rmg-web-02 sshd[21747]: Failed password for nagios from 10.20.9.40 port 55145 ssh2
Aug 15 05:17:01 rmg-web-02 CRON[26226]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 05:17:01 rmg-web-02 CRON[18287]: pam_unix(cron:session): session closed for user root
Aug 15 05:20:20 rmg-web-02 sshd[21748]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 05:20:22 rmg-web-02 sshd[21748]: Failed password for nagios from 10.20.9.40 port 38462 ssh2
Aug 15 05:25:19 rmg-web-02 sshd[21752]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 05:25:21 rmg-web-02 sshd[21752]: Failed password for nagios from 10.20.9.40 port 63004 ssh2
Aug 15 05:25:40 rmg-web-02 sshd[23048]: Invalid user test from 203.0.113.12 port 53134
Aug 15 05:25:41 rmg-web-02 sshd[23048]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 05:25:41 rmg-web-02 sshd[23048]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 05:25:43 rmg-web-02 sshd[23048]: Failed password for invalid user test from 203.0.113.12 port 53134 ssh2
Aug 15 05:25:44 rmg-web-02 sshd[23048]: Connection closed by invalid user test 203.0.113.12 port 53134 [preauth]
Aug 15 05:30:03 rmg-web-02 sshd[21755]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 05:30:05 rmg-web-02 sshd[21755]: Failed password for nagios from 10.20.9.40 port 38445 ssh2
Aug 15 05:30:33 rmg-web-02 sshd[21416]: Accepted publickey for svc-backup from 10.20.9.15 port 59040 ssh2
Aug 15 05:30:34 rmg-web-02 sshd[21416]: pam_unix(sshd:session): session opened for user svc-backup(uid=1500) by (uid=0)
Aug 15 05:34:14 rmg-web-02 sshd[21416]: pam_unix(sshd:session): session closed for user svc-backup
Aug 15 05:35:13 rmg-web-02 sshd[21760]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 05:35:15 rmg-web-02 sshd[21760]: Failed password for nagios from 10.20.9.40 port 48623 ssh2
Aug 15 05:40:19 rmg-web-02 sshd[21766]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 05:40:21 rmg-web-02 sshd[21766]: Failed password for nagios from 10.20.9.40 port 30812 ssh2
Aug 15 05:43:35 rmg-web-02 sshd[23042]: Invalid user ubuntu from 198.51.100.202 port 38101
Aug 15 05:43:36 rmg-web-02 sshd[23042]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 05:43:36 rmg-web-02 sshd[23042]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 05:43:38 rmg-web-02 sshd[23042]: Failed password for invalid user ubuntu from 198.51.100.202 port 38101 ssh2
Aug 15 05:43:39 rmg-web-02 sshd[23042]: Connection closed by invalid user ubuntu 198.51.100.202 port 38101 [preauth]
Aug 15 05:45:13 rmg-web-02 sshd[21769]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 05:45:15 rmg-web-02 sshd[21769]: Failed password for nagios from 10.20.9.40 port 54874 ssh2
Aug 15 05:50:16 rmg-web-02 sshd[21773]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 05:50:18 rmg-web-02 sshd[21773]: Failed password for nagios from 10.20.9.40 port 60783 ssh2
Aug 15 05:55:28 rmg-web-02 sshd[21776]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 05:55:30 rmg-web-02 sshd[21776]: Failed password for nagios from 10.20.9.40 port 38884 ssh2
Aug 15 06:00:05 rmg-web-02 sshd[21780]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 06:00:07 rmg-web-02 sshd[21780]: Failed password for nagios from 10.20.9.40 port 51505 ssh2
Aug 15 06:02:41 rmg-web-02 sshd[23081]: Invalid user pi from 203.0.113.12 port 31888
Aug 15 06:02:42 rmg-web-02 sshd[23081]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 06:02:42 rmg-web-02 sshd[23081]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 06:02:44 rmg-web-02 sshd[23081]: Failed password for invalid user pi from 203.0.113.12 port 31888 ssh2
Aug 15 06:02:45 rmg-web-02 sshd[23081]: Connection closed by invalid user pi 203.0.113.12 port 31888 [preauth]
Aug 15 06:04:52 rmg-web-02 sshd[23063]: Invalid user git from 198.51.100.202 port 52812
Aug 15 06:04:53 rmg-web-02 sshd[23063]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 06:04:53 rmg-web-02 sshd[23063]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 06:04:55 rmg-web-02 sshd[23063]: Failed password for invalid user git from 198.51.100.202 port 52812 ssh2
Aug 15 06:04:56 rmg-web-02 sshd[23063]: Connection closed by invalid user git 198.51.100.202 port 52812 [preauth]
Aug 15 06:05:17 rmg-web-02 sshd[21787]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 06:05:19 rmg-web-02 sshd[21787]: Failed password for nagios from 10.20.9.40 port 56906 ssh2
Aug 15 06:10:28 rmg-web-02 sshd[21794]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 06:10:30 rmg-web-02 sshd[21794]: Failed password for nagios from 10.20.9.40 port 55052 ssh2
Aug 15 06:15:16 rmg-web-02 sshd[21803]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 06:15:18 rmg-web-02 sshd[21803]: Failed password for nagios from 10.20.9.40 port 44427 ssh2
Aug 15 06:17:01 rmg-web-02 CRON[9414]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 06:17:01 rmg-web-02 CRON[24826]: pam_unix(cron:session): session closed for user root
Aug 15 06:20:05 rmg-web-02 sshd[21806]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 06:20:07 rmg-web-02 sshd[21806]: Failed password for nagios from 10.20.9.40 port 36842 ssh2
Aug 15 06:25:14 rmg-web-02 sshd[21812]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 06:25:16 rmg-web-02 sshd[21812]: Failed password for nagios from 10.20.9.40 port 62140 ssh2
Aug 15 06:29:16 rmg-web-02 sshd[23079]: Invalid user support from 198.51.100.23 port 48079
Aug 15 06:29:17 rmg-web-02 sshd[23079]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 06:29:17 rmg-web-02 sshd[23079]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Aug 15 06:29:19 rmg-web-02 sshd[23079]: Failed password for invalid user support from 198.51.100.23 port 48079 ssh2
Aug 15 06:29:20 rmg-web-02 sshd[23079]: Connection closed by invalid user support 198.51.100.23 port 48079 [preauth]
Aug 15 06:30:01 rmg-web-02 sshd[23054]: Invalid user admin from 192.0.2.44 port 59765
Aug 15 06:30:02 rmg-web-02 sshd[23054]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 06:30:02 rmg-web-02 sshd[23054]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 06:30:04 rmg-web-02 sshd[23054]: Failed password for invalid user admin from 192.0.2.44 port 59765 ssh2
Aug 15 06:30:05 rmg-web-02 sshd[23054]: Connection closed by invalid user admin 192.0.2.44 port 59765 [preauth]
Aug 15 06:30:14 rmg-web-02 sshd[21821]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 06:30:16 rmg-web-02 sshd[21821]: Failed password for nagios from 10.20.9.40 port 34705 ssh2
Aug 15 06:35:11 rmg-web-02 sshd[21830]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 06:35:13 rmg-web-02 sshd[21830]: Failed password for nagios from 10.20.9.40 port 44344 ssh2
Aug 15 06:40:00 rmg-web-02 sshd[21833]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 06:40:02 rmg-web-02 sshd[21833]: Failed password for nagios from 10.20.9.40 port 57223 ssh2
Aug 15 06:44:03 rmg-web-02 sshd[23071]: Invalid user guest from 203.0.113.201 port 30088
Aug 15 06:44:04 rmg-web-02 sshd[23071]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 06:44:04 rmg-web-02 sshd[23071]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Aug 15 06:44:06 rmg-web-02 sshd[23071]: Failed password for invalid user guest from 203.0.113.201 port 30088 ssh2
Aug 15 06:44:07 rmg-web-02 sshd[23071]: Connection closed by invalid user guest 203.0.113.201 port 30088 [preauth]
Aug 15 06:45:12 rmg-web-02 sshd[21837]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 06:45:14 rmg-web-02 sshd[21837]: Failed password for nagios from 10.20.9.40 port 60004 ssh2
Aug 15 06:50:19 rmg-web-02 sshd[21842]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 06:50:21 rmg-web-02 sshd[21842]: Failed password for nagios from 10.20.9.40 port 52887 ssh2
Aug 15 06:51:40 rmg-web-02 sshd[23078]: Invalid user jenkins from 203.0.113.201 port 64062
Aug 15 06:51:41 rmg-web-02 sshd[23078]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 06:51:41 rmg-web-02 sshd[23078]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Aug 15 06:51:43 rmg-web-02 sshd[23078]: Failed password for invalid user jenkins from 203.0.113.201 port 64062 ssh2
Aug 15 06:51:44 rmg-web-02 sshd[23078]: Connection closed by invalid user jenkins 203.0.113.201 port 64062 [preauth]
Aug 15 06:55:15 rmg-web-02 sshd[21845]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 06:55:17 rmg-web-02 sshd[21845]: Failed password for nagios from 10.20.9.40 port 39431 ssh2
Aug 15 07:00:04 rmg-web-02 sshd[21854]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 07:00:06 rmg-web-02 sshd[21854]: Failed password for nagios from 10.20.9.40 port 62024 ssh2
Aug 15 07:05:02 rmg-web-02 sshd[21860]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 07:05:04 rmg-web-02 sshd[21860]: Failed password for nagios from 10.20.9.40 port 48863 ssh2
Aug 15 07:10:30 rmg-web-02 sshd[21869]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 07:10:32 rmg-web-02 sshd[21869]: Failed password for nagios from 10.20.9.40 port 32951 ssh2
Aug 15 07:15:24 rmg-web-02 sshd[21877]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 07:15:26 rmg-web-02 sshd[21877]: Failed password for nagios from 10.20.9.40 port 50131 ssh2
Aug 15 07:17:01 rmg-web-02 CRON[24378]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 07:17:01 rmg-web-02 CRON[9288]: pam_unix(cron:session): session closed for user root
Aug 15 07:19:11 rmg-web-02 sshd[23095]: Invalid user ubuntu from 203.0.113.12 port 35650
Aug 15 07:19:12 rmg-web-02 sshd[23095]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 07:19:12 rmg-web-02 sshd[23095]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 07:19:14 rmg-web-02 sshd[23095]: Failed password for invalid user ubuntu from 203.0.113.12 port 35650 ssh2
Aug 15 07:19:15 rmg-web-02 sshd[23095]: Connection closed by invalid user ubuntu 203.0.113.12 port 35650 [preauth]
Aug 15 07:20:00 rmg-web-02 sshd[21883]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 07:20:02 rmg-web-02 sshd[21883]: Failed password for nagios from 10.20.9.40 port 41474 ssh2
Aug 15 07:25:10 rmg-web-02 sshd[21886]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 07:25:12 rmg-web-02 sshd[21886]: Failed password for nagios from 10.20.9.40 port 31756 ssh2
Aug 15 07:30:07 rmg-web-02 sshd[21888]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 07:30:09 rmg-web-02 sshd[21888]: Failed password for nagios from 10.20.9.40 port 52083 ssh2
Aug 15 07:35:14 rmg-web-02 sshd[23086]: Invalid user git from 192.0.2.9 port 51864
Aug 15 07:35:15 rmg-web-02 sshd[23086]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 07:35:15 rmg-web-02 sshd[23086]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.9
Aug 15 07:35:17 rmg-web-02 sshd[23086]: Failed password for invalid user git from 192.0.2.9 port 51864 ssh2
Aug 15 07:35:18 rmg-web-02 sshd[21893]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 07:35:18 rmg-web-02 sshd[23086]: Connection closed by invalid user git 192.0.2.9 port 51864 [preauth]
Aug 15 07:35:20 rmg-web-02 sshd[21893]: Failed password for nagios from 10.20.9.40 port 52656 ssh2
Aug 15 07:38:14 rmg-web-02 sshd[23531]: Accepted password for jmartel from 10.20.4.31 port 51159 ssh2
Aug 15 07:38:15 rmg-web-02 sshd[23531]: pam_unix(sshd:session): session opened for user jmartel(uid=1001) by (uid=0)
Aug 15 07:40:07 rmg-web-02 sshd[21898]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 07:40:09 rmg-web-02 sshd[21898]: Failed password for nagios from 10.20.9.40 port 30725 ssh2
Aug 15 07:43:50 rmg-web-02 sshd[23101]: Invalid user pi from 198.51.100.202 port 58130
Aug 15 07:43:51 rmg-web-02 sshd[23101]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 07:43:51 rmg-web-02 sshd[23101]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 07:43:53 rmg-web-02 sshd[23101]: Failed password for invalid user pi from 198.51.100.202 port 58130 ssh2
Aug 15 07:43:54 rmg-web-02 sshd[23101]: Connection closed by invalid user pi 198.51.100.202 port 58130 [preauth]
Aug 15 07:45:29 rmg-web-02 sshd[21907]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 07:45:31 rmg-web-02 sshd[21907]: Failed password for nagios from 10.20.9.40 port 58462 ssh2
Aug 15 07:49:07 rmg-web-02 sshd[23537]: Accepted password for dokafor from 10.20.4.58 port 51300 ssh2
Aug 15 07:49:08 rmg-web-02 sshd[23537]: pam_unix(sshd:session): session opened for user dokafor(uid=1002) by (uid=0)
Aug 15 07:50:10 rmg-web-02 sshd[21912]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 07:50:12 rmg-web-02 sshd[21912]: Failed password for nagios from 10.20.9.40 port 59249 ssh2
Aug 15 07:51:49 rmg-web-02 sshd[23105]: Invalid user test from 203.0.113.12 port 49234
Aug 15 07:51:50 rmg-web-02 sshd[23105]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 07:51:50 rmg-web-02 sshd[23105]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 07:51:52 rmg-web-02 sshd[23105]: Failed password for invalid user test from 203.0.113.12 port 49234 ssh2
Aug 15 07:51:53 rmg-web-02 sshd[23105]: Connection closed by invalid user test 203.0.113.12 port 49234 [preauth]
Aug 15 07:55:20 rmg-web-02 sshd[21916]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 07:55:22 rmg-web-02 sshd[21916]: Failed password for nagios from 10.20.9.40 port 41290 ssh2
Aug 15 08:00:01 rmg-web-02 sshd[23545]: Accepted password for rchen from 10.20.4.12 port 61773 ssh2
Aug 15 08:00:02 rmg-web-02 sshd[23545]: pam_unix(sshd:session): session opened for user rchen(uid=1003) by (uid=0)
Aug 15 08:00:07 rmg-web-02 sshd[21923]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 08:00:09 rmg-web-02 sshd[21923]: Failed password for nagios from 10.20.9.40 port 55179 ssh2
Aug 15 08:03:48 rmg-web-02 sshd[23120]: Invalid user webmaster from 192.0.2.9 port 37219
Aug 15 08:03:49 rmg-web-02 sshd[23120]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 08:03:49 rmg-web-02 sshd[23120]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.9
Aug 15 08:03:51 rmg-web-02 sshd[23120]: Failed password for invalid user webmaster from 192.0.2.9 port 37219 ssh2
Aug 15 08:03:52 rmg-web-02 sshd[23120]: Connection closed by invalid user webmaster 192.0.2.9 port 37219 [preauth]
Aug 15 08:05:24 rmg-web-02 sshd[21932]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 08:05:26 rmg-web-02 sshd[21932]: Failed password for nagios from 10.20.9.40 port 50433 ssh2
Aug 15 08:10:19 rmg-web-02 sshd[21937]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 08:10:21 rmg-web-02 sshd[21937]: Failed password for nagios from 10.20.9.40 port 64472 ssh2
Aug 15 08:15:08 rmg-web-02 sshd[21944]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 08:15:10 rmg-web-02 sshd[21944]: Failed password for nagios from 10.20.9.40 port 57648 ssh2
Aug 15 08:15:33 rmg-web-02 sudo:  jmartel : TTY=pts/2 ; PWD=/home/jmartel ; USER=root ; COMMAND=/usr/bin/apt-get upgrade -y
Aug 15 08:15:33 rmg-web-02 sudo: pam_unix(sudo:session): session opened for user root(uid=0) by jmartel(uid=1001)
Aug 15 08:17:01 rmg-web-02 CRON[11969]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 08:17:01 rmg-web-02 CRON[26036]: pam_unix(cron:session): session closed for user root
Aug 15 08:20:15 rmg-web-02 sshd[21951]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 08:20:17 rmg-web-02 sshd[21951]: Failed password for nagios from 10.20.9.40 port 39205 ssh2
Aug 15 08:22:47 rmg-web-02 sudo: pam_unix(sudo:session): session closed for user root
Aug 15 08:25:10 rmg-web-02 sshd[21956]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 08:25:12 rmg-web-02 sshd[21956]: Failed password for nagios from 10.20.9.40 port 63142 ssh2
Aug 15 08:28:06 rmg-web-02 sshd[23118]: Invalid user postgres from 203.0.113.12 port 30975
Aug 15 08:28:07 rmg-web-02 sshd[23118]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 08:28:07 rmg-web-02 sshd[23118]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 08:28:09 rmg-web-02 sshd[23118]: Failed password for invalid user postgres from 203.0.113.12 port 30975 ssh2
Aug 15 08:28:10 rmg-web-02 sshd[23118]: Connection closed by invalid user postgres 203.0.113.12 port 30975 [preauth]
Aug 15 08:30:02 rmg-web-02 sshd[21965]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 08:30:04 rmg-web-02 sshd[21965]: Failed password for nagios from 10.20.9.40 port 30968 ssh2
Aug 15 08:35:24 rmg-web-02 sshd[21967]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 08:35:26 rmg-web-02 sshd[21967]: Failed password for nagios from 10.20.9.40 port 64177 ssh2
Aug 15 08:40:23 rmg-web-02 sshd[21973]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 08:40:25 rmg-web-02 sshd[21973]: Failed password for nagios from 10.20.9.40 port 56386 ssh2
Aug 15 08:41:26 rmg-web-02 sshd[23114]: Invalid user deploy from 198.51.100.23 port 31682
Aug 15 08:41:27 rmg-web-02 sshd[23114]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 08:41:27 rmg-web-02 sshd[23114]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Aug 15 08:41:29 rmg-web-02 sshd[23114]: Failed password for invalid user deploy from 198.51.100.23 port 31682 ssh2
Aug 15 08:41:30 rmg-web-02 sshd[23114]: Connection closed by invalid user deploy 198.51.100.23 port 31682 [preauth]
Aug 15 08:45:23 rmg-web-02 sshd[21978]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 08:45:25 rmg-web-02 sshd[21978]: Failed password for nagios from 10.20.9.40 port 64162 ssh2
Aug 15 08:50:24 rmg-web-02 sshd[21981]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 08:50:26 rmg-web-02 sshd[21981]: Failed password for nagios from 10.20.9.40 port 47323 ssh2
Aug 15 08:55:00 rmg-web-02 sshd[21990]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 08:55:02 rmg-web-02 sshd[21990]: Failed password for nagios from 10.20.9.40 port 36926 ssh2
Aug 15 09:00:20 rmg-web-02 sshd[21998]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 09:00:22 rmg-web-02 sshd[21998]: Failed password for nagios from 10.20.9.40 port 50555 ssh2
Aug 15 09:02:14 rmg-web-02 sshd[23546]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.4.58  user=dokafor
Aug 15 09:02:16 rmg-web-02 sshd[23546]: Failed password for dokafor from 10.20.4.58 port 47466 ssh2
Aug 15 09:02:31 rmg-web-02 sshd[23548]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.4.58  user=dokafor
Aug 15 09:02:33 rmg-web-02 sshd[23548]: Failed password for dokafor from 10.20.4.58 port 44268 ssh2
Aug 15 09:02:58 rmg-web-02 sshd[23551]: Accepted password for dokafor from 10.20.4.58 port 44719 ssh2
Aug 15 09:02:59 rmg-web-02 sshd[23551]: pam_unix(sshd:session): session opened for user dokafor(uid=1002) by (uid=0)
Aug 15 09:05:12 rmg-web-02 sshd[22007]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 09:05:14 rmg-web-02 sshd[22007]: Failed password for nagios from 10.20.9.40 port 56143 ssh2
Aug 15 09:05:17 rmg-web-02 sshd[23129]: Invalid user user from 192.0.2.44 port 59047
Aug 15 09:05:18 rmg-web-02 sshd[23129]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:05:18 rmg-web-02 sshd[23129]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 09:05:20 rmg-web-02 sshd[23129]: Failed password for invalid user user from 192.0.2.44 port 59047 ssh2
Aug 15 09:05:21 rmg-web-02 sshd[23129]: Connection closed by invalid user user 192.0.2.44 port 59047 [preauth]
Aug 15 09:10:08 rmg-web-02 sshd[22012]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 09:10:10 rmg-web-02 sshd[22012]: Failed password for nagios from 10.20.9.40 port 62464 ssh2
Aug 15 09:10:53 rmg-web-02 sshd[23144]: Invalid user ftpuser from 203.0.113.140 port 35186
Aug 15 09:10:54 rmg-web-02 sshd[23144]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:10:54 rmg-web-02 sshd[23144]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Aug 15 09:10:56 rmg-web-02 sshd[23144]: Failed password for invalid user ftpuser from 203.0.113.140 port 35186 ssh2
Aug 15 09:10:57 rmg-web-02 sshd[23144]: Connection closed by invalid user ftpuser 203.0.113.140 port 35186 [preauth]
Aug 15 09:12:03 rmg-web-02 sshd[23558]: Invalid user ubuntu from 203.0.113.55 port 50152
Aug 15 09:12:04 rmg-web-02 sshd[23558]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:12:04 rmg-web-02 sshd[23558]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:12:06 rmg-web-02 sshd[23558]: Failed password for invalid user ubuntu from 203.0.113.55 port 50152 ssh2
Aug 15 09:12:07 rmg-web-02 sshd[23558]: Connection closed by invalid user ubuntu 203.0.113.55 port 50152 [preauth]
Aug 15 09:12:11 rmg-web-02 sshd[23562]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=root
Aug 15 09:12:13 rmg-web-02 sshd[23562]: Failed password for root from 203.0.113.55 port 47972 ssh2
Aug 15 09:12:21 rmg-web-02 sshd[23567]: Invalid user oracle from 203.0.113.55 port 45977
Aug 15 09:12:22 rmg-web-02 sshd[23567]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:12:22 rmg-web-02 sshd[23567]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:12:24 rmg-web-02 sshd[23567]: Failed password for invalid user oracle from 203.0.113.55 port 45977 ssh2
Aug 15 09:12:25 rmg-web-02 sshd[23567]: Connection closed by invalid user oracle 203.0.113.55 port 45977 [preauth]
Aug 15 09:12:32 rmg-web-02 sshd[23568]: Invalid user admin from 203.0.113.88 port 45400
Aug 15 09:12:33 rmg-web-02 sshd[23568]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:12:33 rmg-web-02 sshd[23568]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:12:35 rmg-web-02 sshd[23568]: Failed password for invalid user admin from 203.0.113.88 port 45400 ssh2
Aug 15 09:12:36 rmg-web-02 sshd[23568]: Connection closed by invalid user admin 203.0.113.88 port 45400 [preauth]
Aug 15 09:12:40 rmg-web-02 sshd[23577]: Invalid user admin from 203.0.113.88 port 61791
Aug 15 09:12:41 rmg-web-02 sshd[23577]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:12:41 rmg-web-02 sshd[23577]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:12:43 rmg-web-02 sshd[23577]: Failed password for invalid user admin from 203.0.113.88 port 61791 ssh2
Aug 15 09:12:44 rmg-web-02 sshd[23577]: Connection closed by invalid user admin 203.0.113.88 port 61791 [preauth]
Aug 15 09:12:45 rmg-web-02 sshd[23580]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:12:47 rmg-web-02 sshd[23580]: Failed password for postgres from 203.0.113.55 port 60889 ssh2
Aug 15 09:12:55 rmg-web-02 sshd[23588]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:12:57 rmg-web-02 sshd[23588]: Failed password for postgres from 203.0.113.55 port 55863 ssh2
Aug 15 09:13:06 rmg-web-02 sshd[23594]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=postgres
Aug 15 09:13:08 rmg-web-02 sshd[23594]: Failed password for postgres from 203.0.113.88 port 62775 ssh2
Aug 15 09:13:09 rmg-web-02 sshd[23603]: Invalid user admin from 203.0.113.55 port 53992
Aug 15 09:13:10 rmg-web-02 sshd[23603]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:13:10 rmg-web-02 sshd[23603]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:13:12 rmg-web-02 sshd[23603]: Failed password for invalid user admin from 203.0.113.55 port 53992 ssh2
Aug 15 09:13:13 rmg-web-02 sshd[23603]: Connection closed by invalid user admin 203.0.113.55 port 53992 [preauth]
Aug 15 09:13:15 rmg-web-02 sshd[23609]: Invalid user oracle from 203.0.113.55 port 63141
Aug 15 09:13:16 rmg-web-02 sshd[23609]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:13:16 rmg-web-02 sshd[23609]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:13:18 rmg-web-02 sshd[23609]: Failed password for invalid user oracle from 203.0.113.55 port 63141 ssh2
Aug 15 09:13:19 rmg-web-02 sshd[23609]: Connection closed by invalid user oracle 203.0.113.55 port 63141 [preauth]
Aug 15 09:13:20 rmg-web-02 sshd[23611]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:13:22 rmg-web-02 sshd[23611]: Failed password for postgres from 203.0.113.55 port 52252 ssh2
Aug 15 09:13:27 rmg-web-02 sshd[23614]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:13:29 rmg-web-02 sshd[23614]: Failed password for postgres from 203.0.113.55 port 57031 ssh2
Aug 15 09:13:37 rmg-web-02 sshd[23618]: Invalid user oracle from 203.0.113.55 port 53255
Aug 15 09:13:38 rmg-web-02 sshd[23618]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:13:38 rmg-web-02 sshd[23618]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:13:40 rmg-web-02 sshd[23618]: Failed password for invalid user oracle from 203.0.113.55 port 53255 ssh2
Aug 15 09:13:41 rmg-web-02 sshd[23618]: Connection closed by invalid user oracle 203.0.113.55 port 53255 [preauth]
Aug 15 09:13:44 rmg-web-02 sshd[23624]: Invalid user deploy from 198.51.100.77 port 58190
Aug 15 09:13:45 rmg-web-02 sshd[23624]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:13:45 rmg-web-02 sshd[23624]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:13:47 rmg-web-02 sshd[23624]: Failed password for invalid user deploy from 198.51.100.77 port 58190 ssh2
Aug 15 09:13:48 rmg-web-02 sshd[23624]: Connection closed by invalid user deploy 198.51.100.77 port 58190 [preauth]
Aug 15 09:13:52 rmg-web-02 sshd[23632]: Invalid user ubuntu from 203.0.113.55 port 60899
Aug 15 09:13:53 rmg-web-02 sshd[23632]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:13:53 rmg-web-02 sshd[23632]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:13:55 rmg-web-02 sshd[23632]: Failed password for invalid user ubuntu from 203.0.113.55 port 60899 ssh2
Aug 15 09:13:56 rmg-web-02 sshd[23632]: Connection closed by invalid user ubuntu 203.0.113.55 port 60899 [preauth]
Aug 15 09:13:57 rmg-web-02 sshd[23149]: Invalid user deploy from 203.0.113.12 port 47637
Aug 15 09:13:58 rmg-web-02 sshd[23149]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:13:58 rmg-web-02 sshd[23149]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:13:59 rmg-web-02 sshd[23633]: Invalid user deploy from 203.0.113.55 port 59884
Aug 15 09:14:00 rmg-web-02 sshd[23149]: Failed password for invalid user deploy from 203.0.113.12 port 47637 ssh2
Aug 15 09:14:00 rmg-web-02 sshd[23633]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:14:00 rmg-web-02 sshd[23633]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:14:01 rmg-web-02 sshd[23149]: Connection closed by invalid user deploy 203.0.113.12 port 47637 [preauth]
Aug 15 09:14:02 rmg-web-02 sshd[23633]: Failed password for invalid user deploy from 203.0.113.55 port 59884 ssh2
Aug 15 09:14:03 rmg-web-02 sshd[23633]: Connection closed by invalid user deploy 203.0.113.55 port 59884 [preauth]
Aug 15 09:14:08 rmg-web-02 sshd[23637]: Invalid user ubuntu from 203.0.113.55 port 52329
Aug 15 09:14:09 rmg-web-02 sshd[23637]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:14:09 rmg-web-02 sshd[23637]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:14:11 rmg-web-02 sshd[23637]: Failed password for invalid user ubuntu from 203.0.113.55 port 52329 ssh2
Aug 15 09:14:11 rmg-web-02 sshd[23642]: Invalid user git from 198.51.100.77 port 50450
Aug 15 09:14:12 rmg-web-02 sshd[23637]: Connection closed by invalid user ubuntu 203.0.113.55 port 52329 [preauth]
Aug 15 09:14:12 rmg-web-02 sshd[23642]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:14:12 rmg-web-02 sshd[23642]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:14:14 rmg-web-02 sshd[23642]: Failed password for invalid user git from 198.51.100.77 port 50450 ssh2
Aug 15 09:14:15 rmg-web-02 sshd[23642]: Connection closed by invalid user git 198.51.100.77 port 50450 [preauth]
Aug 15 09:14:20 rmg-web-02 sshd[23649]: Invalid user test from 203.0.113.55 port 33991
Aug 15 09:14:21 rmg-web-02 sshd[23649]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:14:21 rmg-web-02 sshd[23649]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:14:23 rmg-web-02 sshd[23649]: Failed password for invalid user test from 203.0.113.55 port 33991 ssh2
Aug 15 09:14:24 rmg-web-02 sshd[23649]: Connection closed by invalid user test 203.0.113.55 port 33991 [preauth]
Aug 15 09:14:26 rmg-web-02 sshd[23654]: Invalid user admin from 198.51.100.77 port 37902
Aug 15 09:14:27 rmg-web-02 sshd[23654]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:14:27 rmg-web-02 sshd[23654]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:14:29 rmg-web-02 sshd[23654]: Failed password for invalid user admin from 198.51.100.77 port 37902 ssh2
Aug 15 09:14:30 rmg-web-02 sshd[23654]: Connection closed by invalid user admin 198.51.100.77 port 37902 [preauth]
Aug 15 09:14:30 rmg-web-02 sshd[23661]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:14:32 rmg-web-02 sshd[23661]: Failed password for postgres from 203.0.113.55 port 32449 ssh2
Aug 15 09:14:40 rmg-web-02 sshd[23670]: Invalid user git from 198.51.100.77 port 58699
Aug 15 09:14:41 rmg-web-02 sshd[23670]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:14:41 rmg-web-02 sshd[23670]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:14:43 rmg-web-02 sshd[23670]: Failed password for invalid user git from 198.51.100.77 port 58699 ssh2
Aug 15 09:14:44 rmg-web-02 sshd[23670]: Connection closed by invalid user git 198.51.100.77 port 58699 [preauth]
Aug 15 09:14:50 rmg-web-02 sshd[23673]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:14:52 rmg-web-02 sshd[23673]: Failed password for postgres from 203.0.113.55 port 38780 ssh2
Aug 15 09:15:01 rmg-web-02 sshd[23679]: Invalid user test from 203.0.113.12 port 36276
Aug 15 09:15:02 rmg-web-02 sshd[23679]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:15:02 rmg-web-02 sshd[23679]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:15:04 rmg-web-02 sshd[23679]: Failed password for invalid user test from 203.0.113.12 port 36276 ssh2
Aug 15 09:15:05 rmg-web-02 sshd[23679]: Connection closed by invalid user test 203.0.113.12 port 36276 [preauth]
Aug 15 09:15:05 rmg-web-02 sshd[23682]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:15:07 rmg-web-02 sshd[23682]: Failed password for postgres from 203.0.113.55 port 45378 ssh2
Aug 15 09:15:14 rmg-web-02 sshd[22021]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 09:15:14 rmg-web-02 sshd[23683]: Invalid user test from 203.0.113.55 port 31847
Aug 15 09:15:15 rmg-web-02 sshd[23683]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:15:15 rmg-web-02 sshd[23683]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:15:16 rmg-web-02 sshd[22021]: Failed password for nagios from 10.20.9.40 port 39100 ssh2
Aug 15 09:15:17 rmg-web-02 sshd[23683]: Failed password for invalid user test from 203.0.113.55 port 31847 ssh2
Aug 15 09:15:18 rmg-web-02 sshd[23683]: Connection closed by invalid user test 203.0.113.55 port 31847 [preauth]
Aug 15 09:15:20 rmg-web-02 sshd[23685]: Invalid user deploy from 198.51.100.77 port 62136
Aug 15 09:15:21 rmg-web-02 sshd[23685]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:15:21 rmg-web-02 sshd[23685]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:15:23 rmg-web-02 sshd[23685]: Failed password for invalid user deploy from 198.51.100.77 port 62136 ssh2
Aug 15 09:15:23 rmg-web-02 sshd[23692]: Invalid user git from 203.0.113.12 port 39232
Aug 15 09:15:24 rmg-web-02 sshd[23685]: Connection closed by invalid user deploy 198.51.100.77 port 62136 [preauth]
Aug 15 09:15:24 rmg-web-02 sshd[23692]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:15:24 rmg-web-02 sshd[23692]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:15:26 rmg-web-02 sshd[23692]: Failed password for invalid user git from 203.0.113.12 port 39232 ssh2
Aug 15 09:15:26 rmg-web-02 sshd[23694]: Invalid user test from 203.0.113.88 port 49285
Aug 15 09:15:27 rmg-web-02 sshd[23692]: Connection closed by invalid user git 203.0.113.12 port 39232 [preauth]
Aug 15 09:15:27 rmg-web-02 sshd[23694]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:15:27 rmg-web-02 sshd[23694]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:15:29 rmg-web-02 sshd[23694]: Failed password for invalid user test from 203.0.113.88 port 49285 ssh2
Aug 15 09:15:29 rmg-web-02 sshd[23699]: Invalid user test from 203.0.113.55 port 46564
Aug 15 09:15:30 rmg-web-02 sshd[23694]: Connection closed by invalid user test 203.0.113.88 port 49285 [preauth]
Aug 15 09:15:30 rmg-web-02 sshd[23699]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:15:30 rmg-web-02 sshd[23699]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:15:32 rmg-web-02 sshd[23699]: Failed password for invalid user test from 203.0.113.55 port 46564 ssh2
Aug 15 09:15:33 rmg-web-02 sshd[23699]: Connection closed by invalid user test 203.0.113.55 port 46564 [preauth]
Aug 15 09:15:35 rmg-web-02 sshd[23707]: Invalid user test from 203.0.113.55 port 55490
Aug 15 09:15:36 rmg-web-02 sshd[23707]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:15:36 rmg-web-02 sshd[23707]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:15:38 rmg-web-02 sshd[23707]: Failed password for invalid user test from 203.0.113.55 port 55490 ssh2
Aug 15 09:15:39 rmg-web-02 sshd[23707]: Connection closed by invalid user test 203.0.113.55 port 55490 [preauth]
Aug 15 09:15:42 rmg-web-02 sshd[23715]: Invalid user deploy from 203.0.113.55 port 34459
Aug 15 09:15:43 rmg-web-02 sshd[23715]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:15:43 rmg-web-02 sshd[23715]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:15:45 rmg-web-02 sshd[23715]: Failed password for invalid user deploy from 203.0.113.55 port 34459 ssh2
Aug 15 09:15:46 rmg-web-02 sshd[23715]: Connection closed by invalid user deploy 203.0.113.55 port 34459 [preauth]
Aug 15 09:15:49 rmg-web-02 sshd[23723]: Invalid user oracle from 203.0.113.88 port 31573
Aug 15 09:15:50 rmg-web-02 sshd[23723]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:15:50 rmg-web-02 sshd[23723]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:15:52 rmg-web-02 sshd[23723]: Failed password for invalid user oracle from 203.0.113.88 port 31573 ssh2
Aug 15 09:15:53 rmg-web-02 sshd[23723]: Connection closed by invalid user oracle 203.0.113.88 port 31573 [preauth]
Aug 15 09:15:59 rmg-web-02 sshd[23727]: Invalid user oracle from 203.0.113.88 port 45269
Aug 15 09:16:00 rmg-web-02 sshd[23727]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:16:00 rmg-web-02 sshd[23727]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:16:02 rmg-web-02 sshd[23727]: Failed password for invalid user oracle from 203.0.113.88 port 45269 ssh2
Aug 15 09:16:02 rmg-web-02 sshd[23732]: Invalid user ubuntu from 203.0.113.88 port 34852
Aug 15 09:16:03 rmg-web-02 sshd[23727]: Connection closed by invalid user oracle 203.0.113.88 port 45269 [preauth]
Aug 15 09:16:03 rmg-web-02 sshd[23732]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:16:03 rmg-web-02 sshd[23732]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:16:05 rmg-web-02 sshd[23732]: Failed password for invalid user ubuntu from 203.0.113.88 port 34852 ssh2
Aug 15 09:16:05 rmg-web-02 sshd[23733]: Invalid user admin from 203.0.113.55 port 48212
Aug 15 09:16:06 rmg-web-02 sshd[23732]: Connection closed by invalid user ubuntu 203.0.113.88 port 34852 [preauth]
Aug 15 09:16:06 rmg-web-02 sshd[23733]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:16:06 rmg-web-02 sshd[23733]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:16:08 rmg-web-02 sshd[23733]: Failed password for invalid user admin from 203.0.113.55 port 48212 ssh2
Aug 15 09:16:09 rmg-web-02 sshd[23733]: Connection closed by invalid user admin 203.0.113.55 port 48212 [preauth]
Aug 15 09:16:09 rmg-web-02 sshd[23737]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=testuser
Aug 15 09:16:11 rmg-web-02 sshd[23737]: Failed password for testuser from 203.0.113.12 port 30199 ssh2
Aug 15 09:16:15 rmg-web-02 sshd[23746]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=testuser
Aug 15 09:16:17 rmg-web-02 sshd[23746]: Failed password for testuser from 203.0.113.12 port 35201 ssh2
Aug 15 09:16:24 rmg-web-02 sshd[23754]: Invalid user admin from 203.0.113.88 port 35915
Aug 15 09:16:25 rmg-web-02 sshd[23754]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:16:25 rmg-web-02 sshd[23754]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:16:27 rmg-web-02 sshd[23754]: Failed password for invalid user admin from 203.0.113.88 port 35915 ssh2
Aug 15 09:16:28 rmg-web-02 sshd[23754]: Connection closed by invalid user admin 203.0.113.88 port 35915 [preauth]
Aug 15 09:16:29 rmg-web-02 sshd[23757]: Invalid user git from 203.0.113.55 port 33817
Aug 15 09:16:30 rmg-web-02 sshd[23757]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:16:30 rmg-web-02 sshd[23757]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:16:32 rmg-web-02 sshd[23757]: Failed password for invalid user git from 203.0.113.55 port 33817 ssh2
Aug 15 09:16:33 rmg-web-02 sshd[23757]: Connection closed by invalid user git 203.0.113.55 port 33817 [preauth]
Aug 15 09:16:37 rmg-web-02 sshd[23759]: Invalid user admin from 203.0.113.55 port 64457
Aug 15 09:16:38 rmg-web-02 sshd[23759]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:16:38 rmg-web-02 sshd[23759]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:16:40 rmg-web-02 sshd[23759]: Failed password for invalid user admin from 203.0.113.55 port 64457 ssh2
Aug 15 09:16:41 rmg-web-02 sshd[23759]: Connection closed by invalid user admin 203.0.113.55 port 64457 [preauth]
Aug 15 09:16:42 rmg-web-02 sshd[23763]: Invalid user test from 203.0.113.55 port 64496
Aug 15 09:16:43 rmg-web-02 sshd[23763]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:16:43 rmg-web-02 sshd[23763]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:16:45 rmg-web-02 sshd[23763]: Failed password for invalid user test from 203.0.113.55 port 64496 ssh2
Aug 15 09:16:46 rmg-web-02 sshd[23763]: Connection closed by invalid user test 203.0.113.55 port 64496 [preauth]
Aug 15 09:16:46 rmg-web-02 sshd[23768]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=root
Aug 15 09:16:48 rmg-web-02 sshd[23768]: Failed password for root from 203.0.113.55 port 64366 ssh2
Aug 15 09:16:52 rmg-web-02 sshd[23776]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:16:54 rmg-web-02 sshd[23776]: Failed password for postgres from 203.0.113.55 port 35091 ssh2
Aug 15 09:16:58 rmg-web-02 sshd[23780]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:17:00 rmg-web-02 sshd[23780]: Failed password for postgres from 203.0.113.55 port 36852 ssh2
Aug 15 09:17:01 rmg-web-02 CRON[18609]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 09:17:01 rmg-web-02 CRON[20389]: pam_unix(cron:session): session closed for user root
Aug 15 09:17:09 rmg-web-02 sshd[23783]: Invalid user deploy from 203.0.113.55 port 60502
Aug 15 09:17:10 rmg-web-02 sshd[23783]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:17:10 rmg-web-02 sshd[23783]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:17:12 rmg-web-02 sshd[23783]: Failed password for invalid user deploy from 203.0.113.55 port 60502 ssh2
Aug 15 09:17:13 rmg-web-02 sshd[23783]: Connection closed by invalid user deploy 203.0.113.55 port 60502 [preauth]
Aug 15 09:17:16 rmg-web-02 sshd[23787]: Invalid user git from 203.0.113.55 port 61450
Aug 15 09:17:17 rmg-web-02 sshd[23787]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:17:17 rmg-web-02 sshd[23787]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:17:19 rmg-web-02 sshd[23787]: Failed password for invalid user git from 203.0.113.55 port 61450 ssh2
Aug 15 09:17:20 rmg-web-02 sshd[23787]: Connection closed by invalid user git 203.0.113.55 port 61450 [preauth]
Aug 15 09:17:21 rmg-web-02 sshd[23794]: Invalid user git from 203.0.113.12 port 31227
Aug 15 09:17:22 rmg-web-02 sshd[23794]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:17:22 rmg-web-02 sshd[23794]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:17:24 rmg-web-02 sshd[23794]: Failed password for invalid user git from 203.0.113.12 port 31227 ssh2
Aug 15 09:17:25 rmg-web-02 sshd[23794]: Connection closed by invalid user git 203.0.113.12 port 31227 [preauth]
Aug 15 09:17:27 rmg-web-02 sshd[23800]: Invalid user oracle from 203.0.113.55 port 50472
Aug 15 09:17:28 rmg-web-02 sshd[23800]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:17:28 rmg-web-02 sshd[23800]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:17:30 rmg-web-02 sshd[23800]: Failed password for invalid user oracle from 203.0.113.55 port 50472 ssh2
Aug 15 09:17:31 rmg-web-02 sshd[23800]: Connection closed by invalid user oracle 203.0.113.55 port 50472 [preauth]
Aug 15 09:17:31 rmg-web-02 sshd[23808]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=testuser
Aug 15 09:17:33 rmg-web-02 sshd[23808]: Failed password for testuser from 203.0.113.12 port 50244 ssh2
Aug 15 09:17:39 rmg-web-02 sshd[23815]: Invalid user oracle from 203.0.113.55 port 51302
Aug 15 09:17:40 rmg-web-02 sshd[23815]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:17:40 rmg-web-02 sshd[23815]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:17:42 rmg-web-02 sshd[23815]: Failed password for invalid user oracle from 203.0.113.55 port 51302 ssh2
Aug 15 09:17:43 rmg-web-02 sshd[23815]: Connection closed by invalid user oracle 203.0.113.55 port 51302 [preauth]
Aug 15 09:17:46 rmg-web-02 sshd[23822]: Invalid user oracle from 203.0.113.55 port 61706
Aug 15 09:17:47 rmg-web-02 sshd[23822]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:17:47 rmg-web-02 sshd[23822]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:17:49 rmg-web-02 sshd[23822]: Failed password for invalid user oracle from 203.0.113.55 port 61706 ssh2
Aug 15 09:17:50 rmg-web-02 sshd[23822]: Connection closed by invalid user oracle 203.0.113.55 port 61706 [preauth]
Aug 15 09:17:52 rmg-web-02 sshd[23828]: Invalid user deploy from 203.0.113.55 port 58995
Aug 15 09:17:53 rmg-web-02 sshd[23828]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:17:53 rmg-web-02 sshd[23828]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:17:55 rmg-web-02 sshd[23828]: Failed password for invalid user deploy from 203.0.113.55 port 58995 ssh2
Aug 15 09:17:56 rmg-web-02 sshd[23828]: Connection closed by invalid user deploy 203.0.113.55 port 58995 [preauth]
Aug 15 09:17:56 rmg-web-02 sshd[23833]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77  user=testuser
Aug 15 09:17:58 rmg-web-02 sshd[23833]: Failed password for testuser from 198.51.100.77 port 40186 ssh2
Aug 15 09:18:01 rmg-web-02 sshd[23840]: Invalid user ubuntu from 203.0.113.55 port 41503
Aug 15 09:18:02 rmg-web-02 sshd[23840]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:18:02 rmg-web-02 sshd[23840]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:18:04 rmg-web-02 sshd[23840]: Failed password for invalid user ubuntu from 203.0.113.55 port 41503 ssh2
Aug 15 09:18:05 rmg-web-02 sshd[23840]: Connection closed by invalid user ubuntu 203.0.113.55 port 41503 [preauth]
Aug 15 09:18:12 rmg-web-02 sshd[23841]: Invalid user git from 203.0.113.88 port 60532
Aug 15 09:18:13 rmg-web-02 sshd[23841]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:18:13 rmg-web-02 sshd[23841]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:18:15 rmg-web-02 sshd[23841]: Failed password for invalid user git from 203.0.113.88 port 60532 ssh2
Aug 15 09:18:16 rmg-web-02 sshd[23841]: Connection closed by invalid user git 203.0.113.88 port 60532 [preauth]
Aug 15 09:18:22 rmg-web-02 sshd[23843]: Invalid user deploy from 203.0.113.55 port 46447
Aug 15 09:18:23 rmg-web-02 sshd[23843]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:18:23 rmg-web-02 sshd[23843]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:18:25 rmg-web-02 sshd[23843]: Failed password for invalid user deploy from 203.0.113.55 port 46447 ssh2
Aug 15 09:18:26 rmg-web-02 sshd[23843]: Connection closed by invalid user deploy 203.0.113.55 port 46447 [preauth]
Aug 15 09:18:30 rmg-web-02 sshd[23846]: Invalid user git from 203.0.113.55 port 50006
Aug 15 09:18:31 rmg-web-02 sshd[23846]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:18:31 rmg-web-02 sshd[23846]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:18:33 rmg-web-02 sshd[23846]: Failed password for invalid user git from 203.0.113.55 port 50006 ssh2
Aug 15 09:18:34 rmg-web-02 sshd[23846]: Connection closed by invalid user git 203.0.113.55 port 50006 [preauth]
Aug 15 09:18:41 rmg-web-02 sshd[23847]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=postgres
Aug 15 09:18:43 rmg-web-02 sshd[23847]: Failed password for postgres from 203.0.113.12 port 63946 ssh2
Aug 15 09:18:52 rmg-web-02 sshd[23856]: Invalid user test from 203.0.113.55 port 36235
Aug 15 09:18:53 rmg-web-02 sshd[23856]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:18:53 rmg-web-02 sshd[23856]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:18:55 rmg-web-02 sshd[23856]: Failed password for invalid user test from 203.0.113.55 port 36235 ssh2
Aug 15 09:18:56 rmg-web-02 sshd[23856]: Connection closed by invalid user test 203.0.113.55 port 36235 [preauth]
Aug 15 09:19:01 rmg-web-02 sshd[23860]: Invalid user git from 198.51.100.77 port 50774
Aug 15 09:19:02 rmg-web-02 sshd[23860]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:19:02 rmg-web-02 sshd[23860]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:19:04 rmg-web-02 sshd[23860]: Failed password for invalid user git from 198.51.100.77 port 50774 ssh2
Aug 15 09:19:05 rmg-web-02 sshd[23860]: Connection closed by invalid user git 198.51.100.77 port 50774 [preauth]
Aug 15 09:19:12 rmg-web-02 sshd[23863]: Invalid user oracle from 203.0.113.55 port 37659
Aug 15 09:19:13 rmg-web-02 sshd[23863]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:19:13 rmg-web-02 sshd[23863]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:19:15 rmg-web-02 sshd[23863]: Failed password for invalid user oracle from 203.0.113.55 port 37659 ssh2
Aug 15 09:19:16 rmg-web-02 sshd[23863]: Connection closed by invalid user oracle 203.0.113.55 port 37659 [preauth]
Aug 15 09:19:16 rmg-web-02 sshd[23868]: Invalid user git from 203.0.113.55 port 42473
Aug 15 09:19:17 rmg-web-02 sshd[23868]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:19:17 rmg-web-02 sshd[23868]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:19:19 rmg-web-02 sshd[23868]: Failed password for invalid user git from 203.0.113.55 port 42473 ssh2
Aug 15 09:19:20 rmg-web-02 sshd[23868]: Connection closed by invalid user git 203.0.113.55 port 42473 [preauth]
Aug 15 09:19:21 rmg-web-02 sshd[23871]: Invalid user ubuntu from 203.0.113.12 port 62382
Aug 15 09:19:22 rmg-web-02 sshd[23871]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:19:22 rmg-web-02 sshd[23871]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:19:24 rmg-web-02 sshd[23871]: Failed password for invalid user ubuntu from 203.0.113.12 port 62382 ssh2
Aug 15 09:19:25 rmg-web-02 sshd[23871]: Connection closed by invalid user ubuntu 203.0.113.12 port 62382 [preauth]
Aug 15 09:19:27 rmg-web-02 sshd[23880]: Invalid user deploy from 203.0.113.55 port 37670
Aug 15 09:19:28 rmg-web-02 sshd[23880]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:19:28 rmg-web-02 sshd[23880]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:19:30 rmg-web-02 sshd[23880]: Failed password for invalid user deploy from 203.0.113.55 port 37670 ssh2
Aug 15 09:19:31 rmg-web-02 sshd[23880]: Connection closed by invalid user deploy 203.0.113.55 port 37670 [preauth]
Aug 15 09:19:31 rmg-web-02 sshd[23885]: Invalid user git from 203.0.113.55 port 42389
Aug 15 09:19:32 rmg-web-02 sshd[23885]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:19:32 rmg-web-02 sshd[23885]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:19:34 rmg-web-02 sshd[23885]: Failed password for invalid user git from 203.0.113.55 port 42389 ssh2
Aug 15 09:19:35 rmg-web-02 sshd[23885]: Connection closed by invalid user git 203.0.113.55 port 42389 [preauth]
Aug 15 09:19:39 rmg-web-02 sshd[23894]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=postgres
Aug 15 09:19:41 rmg-web-02 sshd[23894]: Failed password for postgres from 203.0.113.12 port 50030 ssh2
Aug 15 09:19:44 rmg-web-02 sshd[23895]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77  user=postgres
Aug 15 09:19:46 rmg-web-02 sshd[23895]: Failed password for postgres from 198.51.100.77 port 48981 ssh2
Aug 15 09:19:50 rmg-web-02 sshd[23898]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:19:52 rmg-web-02 sshd[23898]: Failed password for postgres from 203.0.113.55 port 46731 ssh2
Aug 15 09:19:56 rmg-web-02 sshd[23901]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=root
Aug 15 09:19:58 rmg-web-02 sshd[23901]: Failed password for root from 203.0.113.12 port 59971 ssh2
Aug 15 09:20:02 rmg-web-02 sshd[23906]: Invalid user ubuntu from 203.0.113.55 port 43132
Aug 15 09:20:03 rmg-web-02 sshd[23906]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:20:03 rmg-web-02 sshd[23906]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:20:05 rmg-web-02 sshd[23906]: Failed password for invalid user ubuntu from 203.0.113.55 port 43132 ssh2
Aug 15 09:20:05 rmg-web-02 sshd[23914]: Invalid user test from 203.0.113.55 port 63357
Aug 15 09:20:06 rmg-web-02 sshd[23906]: Connection closed by invalid user ubuntu 203.0.113.55 port 43132 [preauth]
Aug 15 09:20:06 rmg-web-02 sshd[23914]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:20:06 rmg-web-02 sshd[23914]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:20:08 rmg-web-02 sshd[23914]: Failed password for invalid user test from 203.0.113.55 port 63357 ssh2
Aug 15 09:20:09 rmg-web-02 sshd[23914]: Connection closed by invalid user test 203.0.113.55 port 63357 [preauth]
Aug 15 09:20:11 rmg-web-02 sshd[23917]: Invalid user oracle from 203.0.113.55 port 47298
Aug 15 09:20:12 rmg-web-02 sshd[23917]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:20:12 rmg-web-02 sshd[23917]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:20:14 rmg-web-02 sshd[23917]: Failed password for invalid user oracle from 203.0.113.55 port 47298 ssh2
Aug 15 09:20:15 rmg-web-02 sshd[23917]: Connection closed by invalid user oracle 203.0.113.55 port 47298 [preauth]
Aug 15 09:20:16 rmg-web-02 sshd[23920]: Invalid user test from 203.0.113.55 port 52523
Aug 15 09:20:17 rmg-web-02 sshd[23920]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:20:17 rmg-web-02 sshd[23920]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:20:19 rmg-web-02 sshd[23920]: Failed password for invalid user test from 203.0.113.55 port 52523 ssh2
Aug 15 09:20:20 rmg-web-02 sshd[23920]: Connection closed by invalid user test 203.0.113.55 port 52523 [preauth]
Aug 15 09:20:23 rmg-web-02 sshd[22030]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 09:20:23 rmg-web-02 sshd[23925]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=testuser
Aug 15 09:20:25 rmg-web-02 sshd[22030]: Failed password for nagios from 10.20.9.40 port 35016 ssh2
Aug 15 09:20:25 rmg-web-02 sshd[23925]: Failed password for testuser from 203.0.113.12 port 47613 ssh2
Aug 15 09:20:31 rmg-web-02 sshd[23930]: Invalid user test from 198.51.100.77 port 45976
Aug 15 09:20:32 rmg-web-02 sshd[23930]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:20:32 rmg-web-02 sshd[23930]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:20:34 rmg-web-02 sshd[23930]: Failed password for invalid user test from 198.51.100.77 port 45976 ssh2
Aug 15 09:20:35 rmg-web-02 sshd[23930]: Connection closed by invalid user test 198.51.100.77 port 45976 [preauth]
Aug 15 09:20:35 rmg-web-02 sshd[23936]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=root
Aug 15 09:20:37 rmg-web-02 sshd[23936]: Failed password for root from 203.0.113.12 port 62153 ssh2
Aug 15 09:20:43 rmg-web-02 sshd[23945]: Invalid user test from 203.0.113.88 port 50930
Aug 15 09:20:44 rmg-web-02 sshd[23945]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:20:44 rmg-web-02 sshd[23945]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:20:46 rmg-web-02 sshd[23945]: Failed password for invalid user test from 203.0.113.88 port 50930 ssh2
Aug 15 09:20:47 rmg-web-02 sshd[23945]: Connection closed by invalid user test 203.0.113.88 port 50930 [preauth]
Aug 15 09:20:47 rmg-web-02 sshd[23950]: Invalid user deploy from 203.0.113.55 port 30430
Aug 15 09:20:48 rmg-web-02 sshd[23950]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:20:48 rmg-web-02 sshd[23950]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:20:50 rmg-web-02 sshd[23950]: Failed password for invalid user deploy from 203.0.113.55 port 30430 ssh2
Aug 15 09:20:51 rmg-web-02 sshd[23950]: Connection closed by invalid user deploy 203.0.113.55 port 30430 [preauth]
Aug 15 09:20:56 rmg-web-02 sshd[23958]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77  user=postgres
Aug 15 09:20:58 rmg-web-02 sshd[23958]: Failed password for postgres from 198.51.100.77 port 43790 ssh2
Aug 15 09:21:02 rmg-web-02 sshd[23961]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=postgres
Aug 15 09:21:04 rmg-web-02 sshd[23961]: Failed password for postgres from 203.0.113.88 port 35883 ssh2
Aug 15 09:21:07 rmg-web-02 sshd[23962]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:21:09 rmg-web-02 sshd[23962]: Failed password for postgres from 203.0.113.55 port 51541 ssh2
Aug 15 09:21:11 rmg-web-02 sshd[23966]: Invalid user oracle from 198.51.100.77 port 61546
Aug 15 09:21:12 rmg-web-02 sshd[23966]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:21:12 rmg-web-02 sshd[23966]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:21:14 rmg-web-02 sshd[23966]: Failed password for invalid user oracle from 198.51.100.77 port 61546 ssh2
Aug 15 09:21:15 rmg-web-02 sshd[23966]: Connection closed by invalid user oracle 198.51.100.77 port 61546 [preauth]
Aug 15 09:21:20 rmg-web-02 sshd[23970]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:21:22 rmg-web-02 sshd[23970]: Failed password for postgres from 203.0.113.55 port 55707 ssh2
Aug 15 09:21:24 rmg-web-02 sshd[23979]: Invalid user test from 203.0.113.12 port 53977
Aug 15 09:21:25 rmg-web-02 sshd[23979]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:21:25 rmg-web-02 sshd[23979]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:21:27 rmg-web-02 sshd[23979]: Failed password for invalid user test from 203.0.113.12 port 53977 ssh2
Aug 15 09:21:28 rmg-web-02 sshd[23979]: Connection closed by invalid user test 203.0.113.12 port 53977 [preauth]
Aug 15 09:21:31 rmg-web-02 sshd[23985]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:21:33 rmg-web-02 sshd[23985]: Failed password for postgres from 203.0.113.55 port 38321 ssh2
Aug 15 09:21:39 rmg-web-02 sshd[23988]: Invalid user admin from 203.0.113.55 port 35306
Aug 15 09:21:40 rmg-web-02 sshd[23988]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:21:40 rmg-web-02 sshd[23988]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:21:42 rmg-web-02 sshd[23988]: Failed password for invalid user admin from 203.0.113.55 port 35306 ssh2
Aug 15 09:21:43 rmg-web-02 sshd[23988]: Connection closed by invalid user admin 203.0.113.55 port 35306 [preauth]
Aug 15 09:21:50 rmg-web-02 sshd[23994]: Invalid user admin from 203.0.113.55 port 54787
Aug 15 09:21:51 rmg-web-02 sshd[23994]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:21:51 rmg-web-02 sshd[23994]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:21:53 rmg-web-02 sshd[23994]: Failed password for invalid user admin from 203.0.113.55 port 54787 ssh2
Aug 15 09:21:54 rmg-web-02 sshd[23994]: Connection closed by invalid user admin 203.0.113.55 port 54787 [preauth]
Aug 15 09:21:58 rmg-web-02 sshd[23995]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=testuser
Aug 15 09:22:00 rmg-web-02 sshd[23995]: Failed password for testuser from 203.0.113.55 port 38767 ssh2
Aug 15 09:22:03 rmg-web-02 sshd[24002]: Invalid user git from 203.0.113.88 port 37033
Aug 15 09:22:04 rmg-web-02 sshd[24002]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:22:04 rmg-web-02 sshd[24002]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:22:06 rmg-web-02 sshd[24002]: Failed password for invalid user git from 203.0.113.88 port 37033 ssh2
Aug 15 09:22:07 rmg-web-02 sshd[24002]: Connection closed by invalid user git 203.0.113.88 port 37033 [preauth]
Aug 15 09:22:09 rmg-web-02 sshd[24010]: Invalid user admin from 203.0.113.55 port 55190
Aug 15 09:22:10 rmg-web-02 sshd[24010]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:22:10 rmg-web-02 sshd[24010]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:22:12 rmg-web-02 sshd[24010]: Failed password for invalid user admin from 203.0.113.55 port 55190 ssh2
Aug 15 09:22:13 rmg-web-02 sshd[24010]: Connection closed by invalid user admin 203.0.113.55 port 55190 [preauth]
Aug 15 09:22:18 rmg-web-02 sshd[24014]: Invalid user git from 198.51.100.77 port 64526
Aug 15 09:22:19 rmg-web-02 sshd[24014]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:22:19 rmg-web-02 sshd[24014]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:22:21 rmg-web-02 sshd[24014]: Failed password for invalid user git from 198.51.100.77 port 64526 ssh2
Aug 15 09:22:21 rmg-web-02 sshd[24019]: Invalid user oracle from 203.0.113.55 port 64609
Aug 15 09:22:22 rmg-web-02 sshd[24014]: Connection closed by invalid user git 198.51.100.77 port 64526 [preauth]
Aug 15 09:22:22 rmg-web-02 sshd[24019]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:22:22 rmg-web-02 sshd[24019]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:22:24 rmg-web-02 sshd[24019]: Failed password for invalid user oracle from 203.0.113.55 port 64609 ssh2
Aug 15 09:22:25 rmg-web-02 sshd[24019]: Connection closed by invalid user oracle 203.0.113.55 port 64609 [preauth]
Aug 15 09:22:25 rmg-web-02 sshd[24027]: Invalid user test from 203.0.113.12 port 64697
Aug 15 09:22:26 rmg-web-02 sshd[24027]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:22:26 rmg-web-02 sshd[24027]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:22:28 rmg-web-02 sshd[24027]: Failed password for invalid user test from 203.0.113.12 port 64697 ssh2
Aug 15 09:22:29 rmg-web-02 sshd[24027]: Connection closed by invalid user test 203.0.113.12 port 64697 [preauth]
Aug 15 09:22:31 rmg-web-02 sshd[24028]: Invalid user test from 203.0.113.55 port 33771
Aug 15 09:22:32 rmg-web-02 sshd[24028]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:22:32 rmg-web-02 sshd[24028]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:22:34 rmg-web-02 sshd[24028]: Failed password for invalid user test from 203.0.113.55 port 33771 ssh2
Aug 15 09:22:35 rmg-web-02 sshd[24028]: Connection closed by invalid user test 203.0.113.55 port 33771 [preauth]
Aug 15 09:22:40 rmg-web-02 sshd[24033]: Invalid user deploy from 203.0.113.55 port 30679
Aug 15 09:22:41 rmg-web-02 sshd[24033]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:22:41 rmg-web-02 sshd[24033]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:22:43 rmg-web-02 sshd[24033]: Failed password for invalid user deploy from 203.0.113.55 port 30679 ssh2
Aug 15 09:22:44 rmg-web-02 sshd[24033]: Connection closed by invalid user deploy 203.0.113.55 port 30679 [preauth]
Aug 15 09:22:44 rmg-web-02 sshd[24039]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=root
Aug 15 09:22:46 rmg-web-02 sshd[24039]: Failed password for root from 203.0.113.55 port 42146 ssh2
Aug 15 09:22:49 rmg-web-02 sshd[24042]: Invalid user git from 203.0.113.55 port 45402
Aug 15 09:22:50 rmg-web-02 sshd[24042]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:22:50 rmg-web-02 sshd[24042]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:22:52 rmg-web-02 sshd[24042]: Failed password for invalid user git from 203.0.113.55 port 45402 ssh2
Aug 15 09:22:53 rmg-web-02 sshd[24042]: Connection closed by invalid user git 203.0.113.55 port 45402 [preauth]
Aug 15 09:22:57 rmg-web-02 sshd[24047]: Invalid user oracle from 203.0.113.55 port 52965
Aug 15 09:22:58 rmg-web-02 sshd[24047]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:22:58 rmg-web-02 sshd[24047]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:23:00 rmg-web-02 sshd[24047]: Failed password for invalid user oracle from 203.0.113.55 port 52965 ssh2
Aug 15 09:23:01 rmg-web-02 sshd[24047]: Connection closed by invalid user oracle 203.0.113.55 port 52965 [preauth]
Aug 15 09:23:07 rmg-web-02 sshd[24053]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:23:09 rmg-web-02 sshd[24053]: Failed password for postgres from 203.0.113.55 port 36716 ssh2
Aug 15 09:23:12 rmg-web-02 sshd[24062]: Invalid user git from 203.0.113.55 port 32147
Aug 15 09:23:13 rmg-web-02 sshd[24062]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:23:13 rmg-web-02 sshd[24062]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:23:15 rmg-web-02 sshd[24062]: Failed password for invalid user git from 203.0.113.55 port 32147 ssh2
Aug 15 09:23:16 rmg-web-02 sshd[24062]: Connection closed by invalid user git 203.0.113.55 port 32147 [preauth]
Aug 15 09:23:22 rmg-web-02 sshd[24065]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=testuser
Aug 15 09:23:24 rmg-web-02 sshd[24065]: Failed password for testuser from 203.0.113.12 port 42700 ssh2
Aug 15 09:23:26 rmg-web-02 sshd[24067]: Invalid user oracle from 203.0.113.55 port 45516
Aug 15 09:23:27 rmg-web-02 sshd[24067]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:23:27 rmg-web-02 sshd[24067]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:23:29 rmg-web-02 sshd[24067]: Failed password for invalid user oracle from 203.0.113.55 port 45516 ssh2
Aug 15 09:23:30 rmg-web-02 sshd[24067]: Connection closed by invalid user oracle 203.0.113.55 port 45516 [preauth]
Aug 15 09:23:34 rmg-web-02 sshd[24068]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:23:36 rmg-web-02 sshd[24068]: Failed password for postgres from 203.0.113.55 port 34281 ssh2
Aug 15 09:23:45 rmg-web-02 sshd[24074]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=postgres
Aug 15 09:23:47 rmg-web-02 sshd[24074]: Failed password for postgres from 203.0.113.88 port 60841 ssh2
Aug 15 09:23:51 rmg-web-02 sshd[24080]: Invalid user oracle from 203.0.113.55 port 59130
Aug 15 09:23:52 rmg-web-02 sshd[24080]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:23:52 rmg-web-02 sshd[24080]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:23:54 rmg-web-02 sshd[24080]: Failed password for invalid user oracle from 203.0.113.55 port 59130 ssh2
Aug 15 09:23:55 rmg-web-02 sshd[24080]: Connection closed by invalid user oracle 203.0.113.55 port 59130 [preauth]
Aug 15 09:24:01 rmg-web-02 sshd[24083]: Invalid user ubuntu from 203.0.113.12 port 34565
Aug 15 09:24:02 rmg-web-02 sshd[24083]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:24:02 rmg-web-02 sshd[24083]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:24:04 rmg-web-02 sshd[24083]: Failed password for invalid user ubuntu from 203.0.113.12 port 34565 ssh2
Aug 15 09:24:05 rmg-web-02 sshd[24083]: Connection closed by invalid user ubuntu 203.0.113.12 port 34565 [preauth]
Aug 15 09:24:10 rmg-web-02 sshd[24085]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=root
Aug 15 09:24:12 rmg-web-02 sshd[24085]: Failed password for root from 203.0.113.88 port 46677 ssh2
Aug 15 09:24:18 rmg-web-02 sshd[24093]: Invalid user admin from 198.51.100.77 port 46623
Aug 15 09:24:19 rmg-web-02 sshd[24093]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:24:19 rmg-web-02 sshd[24093]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:24:21 rmg-web-02 sshd[24093]: Failed password for invalid user admin from 198.51.100.77 port 46623 ssh2
Aug 15 09:24:22 rmg-web-02 sshd[24093]: Connection closed by invalid user admin 198.51.100.77 port 46623 [preauth]
Aug 15 09:24:24 rmg-web-02 sshd[24096]: Invalid user test from 203.0.113.55 port 32947
Aug 15 09:24:25 rmg-web-02 sshd[24096]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:24:25 rmg-web-02 sshd[24096]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:24:27 rmg-web-02 sshd[24096]: Failed password for invalid user test from 203.0.113.55 port 32947 ssh2
Aug 15 09:24:28 rmg-web-02 sshd[24096]: Connection closed by invalid user test 203.0.113.55 port 32947 [preauth]
Aug 15 09:24:30 rmg-web-02 sshd[24098]: Invalid user test from 203.0.113.55 port 33468
Aug 15 09:24:31 rmg-web-02 sshd[24098]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:24:31 rmg-web-02 sshd[24098]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:24:33 rmg-web-02 sshd[24098]: Failed password for invalid user test from 203.0.113.55 port 33468 ssh2
Aug 15 09:24:34 rmg-web-02 sshd[24098]: Connection closed by invalid user test 203.0.113.55 port 33468 [preauth]
Aug 15 09:24:38 rmg-web-02 sshd[24100]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=root
Aug 15 09:24:40 rmg-web-02 sshd[24100]: Failed password for root from 203.0.113.55 port 39996 ssh2
Aug 15 09:24:42 rmg-web-02 sshd[24104]: Invalid user ubuntu from 203.0.113.55 port 38015
Aug 15 09:24:43 rmg-web-02 sshd[24104]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:24:43 rmg-web-02 sshd[24104]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:24:45 rmg-web-02 sshd[24104]: Failed password for invalid user ubuntu from 203.0.113.55 port 38015 ssh2
Aug 15 09:24:46 rmg-web-02 sshd[24104]: Connection closed by invalid user ubuntu 203.0.113.55 port 38015 [preauth]
Aug 15 09:24:49 rmg-web-02 sshd[24106]: Invalid user admin from 203.0.113.55 port 45050
Aug 15 09:24:50 rmg-web-02 sshd[24106]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:24:50 rmg-web-02 sshd[24106]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:24:52 rmg-web-02 sshd[24106]: Failed password for invalid user admin from 203.0.113.55 port 45050 ssh2
Aug 15 09:24:52 rmg-web-02 sshd[24115]: Invalid user oracle from 198.51.100.77 port 62180
Aug 15 09:24:53 rmg-web-02 sshd[24106]: Connection closed by invalid user admin 203.0.113.55 port 45050 [preauth]
Aug 15 09:24:53 rmg-web-02 sshd[24115]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:24:53 rmg-web-02 sshd[24115]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:24:55 rmg-web-02 sshd[24115]: Failed password for invalid user oracle from 198.51.100.77 port 62180 ssh2
Aug 15 09:24:56 rmg-web-02 sshd[24115]: Connection closed by invalid user oracle 198.51.100.77 port 62180 [preauth]
Aug 15 09:24:57 rmg-web-02 sshd[24121]: Invalid user ubuntu from 203.0.113.55 port 31641
Aug 15 09:24:58 rmg-web-02 sshd[24121]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:24:58 rmg-web-02 sshd[24121]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:25:00 rmg-web-02 sshd[24121]: Failed password for invalid user ubuntu from 203.0.113.55 port 31641 ssh2
Aug 15 09:25:01 rmg-web-02 sshd[24121]: Connection closed by invalid user ubuntu 203.0.113.55 port 31641 [preauth]
Aug 15 09:25:07 rmg-web-02 sshd[24124]: Invalid user test from 203.0.113.55 port 48426
Aug 15 09:25:08 rmg-web-02 sshd[24124]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:25:08 rmg-web-02 sshd[24124]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:25:10 rmg-web-02 sshd[22037]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 09:25:10 rmg-web-02 sshd[24124]: Failed password for invalid user test from 203.0.113.55 port 48426 ssh2
Aug 15 09:25:11 rmg-web-02 sshd[24124]: Connection closed by invalid user test 203.0.113.55 port 48426 [preauth]
Aug 15 09:25:12 rmg-web-02 sshd[22037]: Failed password for nagios from 10.20.9.40 port 50563 ssh2
Aug 15 09:25:12 rmg-web-02 sshd[24131]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:25:14 rmg-web-02 sshd[24131]: Failed password for postgres from 203.0.113.55 port 57150 ssh2
Aug 15 09:25:23 rmg-web-02 sshd[24135]: Invalid user git from 203.0.113.55 port 57426
Aug 15 09:25:24 rmg-web-02 sshd[24135]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:25:24 rmg-web-02 sshd[24135]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:25:26 rmg-web-02 sshd[24135]: Failed password for invalid user git from 203.0.113.55 port 57426 ssh2
Aug 15 09:25:27 rmg-web-02 sshd[24135]: Connection closed by invalid user git 203.0.113.55 port 57426 [preauth]
Aug 15 09:25:29 rmg-web-02 sshd[24144]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=root
Aug 15 09:25:31 rmg-web-02 sshd[24144]: Failed password for root from 203.0.113.55 port 57927 ssh2
Aug 15 09:25:39 rmg-web-02 sshd[24153]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=testuser
Aug 15 09:25:41 rmg-web-02 sshd[24153]: Failed password for testuser from 203.0.113.55 port 47631 ssh2
Aug 15 09:25:47 rmg-web-02 sshd[24162]: Invalid user deploy from 198.51.100.77 port 60578
Aug 15 09:25:48 rmg-web-02 sshd[24162]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:25:48 rmg-web-02 sshd[24162]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:25:50 rmg-web-02 sshd[24162]: Failed password for invalid user deploy from 198.51.100.77 port 60578 ssh2
Aug 15 09:25:51 rmg-web-02 sshd[24162]: Connection closed by invalid user deploy 198.51.100.77 port 60578 [preauth]
Aug 15 09:25:54 rmg-web-02 sshd[24164]: Invalid user oracle from 203.0.113.55 port 53940
Aug 15 09:25:55 rmg-web-02 sshd[24164]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:25:55 rmg-web-02 sshd[24164]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:25:57 rmg-web-02 sshd[24164]: Failed password for invalid user oracle from 203.0.113.55 port 53940 ssh2
Aug 15 09:25:58 rmg-web-02 sshd[24164]: Connection closed by invalid user oracle 203.0.113.55 port 53940 [preauth]
Aug 15 09:25:58 rmg-web-02 sshd[24166]: Invalid user deploy from 203.0.113.55 port 46604
Aug 15 09:25:59 rmg-web-02 sshd[24166]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:25:59 rmg-web-02 sshd[24166]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:26:01 rmg-web-02 sshd[24166]: Failed password for invalid user deploy from 203.0.113.55 port 46604 ssh2
Aug 15 09:26:01 rmg-web-02 sshd[24173]: Invalid user ubuntu from 203.0.113.12 port 45190
Aug 15 09:26:02 rmg-web-02 sshd[24166]: Connection closed by invalid user deploy 203.0.113.55 port 46604 [preauth]
Aug 15 09:26:02 rmg-web-02 sshd[24173]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:26:02 rmg-web-02 sshd[24173]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:26:04 rmg-web-02 sshd[24173]: Failed password for invalid user ubuntu from 203.0.113.12 port 45190 ssh2
Aug 15 09:26:05 rmg-web-02 sshd[24173]: Connection closed by invalid user ubuntu 203.0.113.12 port 45190 [preauth]
Aug 15 09:26:05 rmg-web-02 sshd[24174]: Invalid user oracle from 203.0.113.12 port 55066
Aug 15 09:26:06 rmg-web-02 sshd[24174]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:26:06 rmg-web-02 sshd[24174]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:26:08 rmg-web-02 sshd[24174]: Failed password for invalid user oracle from 203.0.113.12 port 55066 ssh2
Aug 15 09:26:09 rmg-web-02 sshd[24174]: Connection closed by invalid user oracle 203.0.113.12 port 55066 [preauth]
Aug 15 09:26:15 rmg-web-02 sshd[24178]: Invalid user ubuntu from 203.0.113.55 port 48446
Aug 15 09:26:16 rmg-web-02 sshd[24178]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:26:16 rmg-web-02 sshd[24178]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:26:18 rmg-web-02 sshd[24178]: Failed password for invalid user ubuntu from 203.0.113.55 port 48446 ssh2
Aug 15 09:26:19 rmg-web-02 sshd[24178]: Connection closed by invalid user ubuntu 203.0.113.55 port 48446 [preauth]
Aug 15 09:26:26 rmg-web-02 sshd[24185]: Invalid user ubuntu from 203.0.113.88 port 34508
Aug 15 09:26:27 rmg-web-02 sshd[24185]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:26:27 rmg-web-02 sshd[24185]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:26:29 rmg-web-02 sshd[24185]: Failed password for invalid user ubuntu from 203.0.113.88 port 34508 ssh2
Aug 15 09:26:29 rmg-web-02 sshd[24187]: Invalid user deploy from 203.0.113.12 port 42629
Aug 15 09:26:30 rmg-web-02 sshd[24185]: Connection closed by invalid user ubuntu 203.0.113.88 port 34508 [preauth]
Aug 15 09:26:30 rmg-web-02 sshd[24187]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:26:30 rmg-web-02 sshd[24187]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:26:32 rmg-web-02 sshd[24187]: Failed password for invalid user deploy from 203.0.113.12 port 42629 ssh2
Aug 15 09:26:33 rmg-web-02 sshd[24187]: Connection closed by invalid user deploy 203.0.113.12 port 42629 [preauth]
Aug 15 09:26:38 rmg-web-02 sshd[24188]: Invalid user ubuntu from 203.0.113.88 port 48690
Aug 15 09:26:39 rmg-web-02 sshd[24188]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:26:39 rmg-web-02 sshd[24188]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:26:41 rmg-web-02 sshd[24188]: Failed password for invalid user ubuntu from 203.0.113.88 port 48690 ssh2
Aug 15 09:26:42 rmg-web-02 sshd[24188]: Connection closed by invalid user ubuntu 203.0.113.88 port 48690 [preauth]
Aug 15 09:26:43 rmg-web-02 sshd[24191]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:26:45 rmg-web-02 sshd[24191]: Failed password for postgres from 203.0.113.55 port 35362 ssh2
Aug 15 09:26:46 rmg-web-02 sshd[24199]: Invalid user git from 203.0.113.88 port 60593
Aug 15 09:26:47 rmg-web-02 sshd[24199]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:26:47 rmg-web-02 sshd[24199]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:26:49 rmg-web-02 sshd[24199]: Failed password for invalid user git from 203.0.113.88 port 60593 ssh2
Aug 15 09:26:50 rmg-web-02 sshd[24199]: Connection closed by invalid user git 203.0.113.88 port 60593 [preauth]
Aug 15 09:26:51 rmg-web-02 sshd[24203]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:26:53 rmg-web-02 sshd[24203]: Failed password for postgres from 203.0.113.55 port 56766 ssh2
Aug 15 09:27:02 rmg-web-02 sshd[24210]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:27:04 rmg-web-02 sshd[24210]: Failed password for postgres from 203.0.113.55 port 46689 ssh2
Aug 15 09:27:09 rmg-web-02 sshd[24217]: Invalid user admin from 203.0.113.55 port 60363
Aug 15 09:27:10 rmg-web-02 sshd[24217]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:27:10 rmg-web-02 sshd[24217]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:27:12 rmg-web-02 sshd[24217]: Failed password for invalid user admin from 203.0.113.55 port 60363 ssh2
Aug 15 09:27:13 rmg-web-02 sshd[24217]: Connection closed by invalid user admin 203.0.113.55 port 60363 [preauth]
Aug 15 09:27:14 rmg-web-02 sshd[24222]: Invalid user admin from 203.0.113.55 port 38061
Aug 15 09:27:15 rmg-web-02 sshd[24222]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:27:15 rmg-web-02 sshd[24222]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:27:17 rmg-web-02 sshd[24222]: Failed password for invalid user admin from 203.0.113.55 port 38061 ssh2
Aug 15 09:27:18 rmg-web-02 sshd[24222]: Connection closed by invalid user admin 203.0.113.55 port 38061 [preauth]
Aug 15 09:27:21 rmg-web-02 sshd[24230]: Invalid user test from 203.0.113.55 port 53864
Aug 15 09:27:22 rmg-web-02 sshd[24230]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:27:22 rmg-web-02 sshd[24230]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:27:24 rmg-web-02 sshd[24230]: Failed password for invalid user test from 203.0.113.55 port 53864 ssh2
Aug 15 09:27:25 rmg-web-02 sshd[24230]: Connection closed by invalid user test 203.0.113.55 port 53864 [preauth]
Aug 15 09:27:27 rmg-web-02 sshd[24239]: Invalid user test from 203.0.113.55 port 33454
Aug 15 09:27:28 rmg-web-02 sshd[24239]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:27:28 rmg-web-02 sshd[24239]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:27:30 rmg-web-02 sshd[24239]: Failed password for invalid user test from 203.0.113.55 port 33454 ssh2
Aug 15 09:27:31 rmg-web-02 sshd[24239]: Connection closed by invalid user test 203.0.113.55 port 33454 [preauth]
Aug 15 09:27:37 rmg-web-02 sshd[24245]: Invalid user admin from 203.0.113.55 port 40271
Aug 15 09:27:38 rmg-web-02 sshd[24245]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:27:38 rmg-web-02 sshd[24245]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:27:40 rmg-web-02 sshd[24245]: Failed password for invalid user admin from 203.0.113.55 port 40271 ssh2
Aug 15 09:27:41 rmg-web-02 sshd[24245]: Connection closed by invalid user admin 203.0.113.55 port 40271 [preauth]
Aug 15 09:27:45 rmg-web-02 sshd[24248]: Invalid user admin from 203.0.113.12 port 47547
Aug 15 09:27:46 rmg-web-02 sshd[24248]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:27:46 rmg-web-02 sshd[24248]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:27:48 rmg-web-02 sshd[24248]: Failed password for invalid user admin from 203.0.113.12 port 47547 ssh2
Aug 15 09:27:49 rmg-web-02 sshd[24248]: Connection closed by invalid user admin 203.0.113.12 port 47547 [preauth]
Aug 15 09:27:51 rmg-web-02 sshd[24251]: Invalid user oracle from 203.0.113.55 port 42883
Aug 15 09:27:52 rmg-web-02 sshd[24251]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:27:52 rmg-web-02 sshd[24251]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:27:54 rmg-web-02 sshd[24251]: Failed password for invalid user oracle from 203.0.113.55 port 42883 ssh2
Aug 15 09:27:55 rmg-web-02 sshd[24251]: Connection closed by invalid user oracle 203.0.113.55 port 42883 [preauth]
Aug 15 09:28:02 rmg-web-02 sshd[24257]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=testuser
Aug 15 09:28:04 rmg-web-02 sshd[24257]: Failed password for testuser from 203.0.113.55 port 63323 ssh2
Aug 15 09:28:07 rmg-web-02 sshd[24258]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=root
Aug 15 09:28:09 rmg-web-02 sshd[24258]: Failed password for root from 203.0.113.55 port 37093 ssh2
Aug 15 09:28:13 rmg-web-02 sshd[24263]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:28:15 rmg-web-02 sshd[24263]: Failed password for postgres from 203.0.113.55 port 44308 ssh2
Aug 15 09:28:23 rmg-web-02 sshd[24265]: Invalid user deploy from 203.0.113.55 port 63516
Aug 15 09:28:24 rmg-web-02 sshd[24265]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:28:24 rmg-web-02 sshd[24265]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:28:26 rmg-web-02 sshd[24265]: Failed password for invalid user deploy from 203.0.113.55 port 63516 ssh2
Aug 15 09:28:27 rmg-web-02 sshd[24265]: Connection closed by invalid user deploy 203.0.113.55 port 63516 [preauth]
Aug 15 09:28:30 rmg-web-02 sshd[24271]: Invalid user deploy from 203.0.113.55 port 64950
Aug 15 09:28:31 rmg-web-02 sshd[24271]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:28:31 rmg-web-02 sshd[24271]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:28:33 rmg-web-02 sshd[24271]: Failed password for invalid user deploy from 203.0.113.55 port 64950 ssh2
Aug 15 09:28:34 rmg-web-02 sshd[24271]: Connection closed by invalid user deploy 203.0.113.55 port 64950 [preauth]
Aug 15 09:28:39 rmg-web-02 sshd[24275]: Invalid user test from 203.0.113.55 port 57822
Aug 15 09:28:40 rmg-web-02 sshd[24275]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:28:40 rmg-web-02 sshd[24275]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:28:42 rmg-web-02 sshd[24275]: Failed password for invalid user test from 203.0.113.55 port 57822 ssh2
Aug 15 09:28:43 rmg-web-02 sshd[24275]: Connection closed by invalid user test 203.0.113.55 port 57822 [preauth]
Aug 15 09:28:44 rmg-web-02 sshd[24284]: Invalid user deploy from 203.0.113.55 port 59634
Aug 15 09:28:45 rmg-web-02 sshd[24284]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:28:45 rmg-web-02 sshd[24284]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:28:47 rmg-web-02 sshd[24284]: Failed password for invalid user deploy from 203.0.113.55 port 59634 ssh2
Aug 15 09:28:48 rmg-web-02 sshd[24284]: Connection closed by invalid user deploy 203.0.113.55 port 59634 [preauth]
Aug 15 09:28:54 rmg-web-02 sshd[24290]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=testuser
Aug 15 09:28:56 rmg-web-02 sshd[24290]: Failed password for testuser from 203.0.113.55 port 38372 ssh2
Aug 15 09:29:05 rmg-web-02 sshd[24293]: Invalid user test from 198.51.100.77 port 45603
Aug 15 09:29:06 rmg-web-02 sshd[24293]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:29:06 rmg-web-02 sshd[24293]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:29:08 rmg-web-02 sshd[24293]: Failed password for invalid user test from 198.51.100.77 port 45603 ssh2
Aug 15 09:29:09 rmg-web-02 sshd[24293]: Connection closed by invalid user test 198.51.100.77 port 45603 [preauth]
Aug 15 09:29:13 rmg-web-02 sshd[24301]: Invalid user git from 203.0.113.55 port 39629
Aug 15 09:29:14 rmg-web-02 sshd[24301]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:29:14 rmg-web-02 sshd[24301]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:29:16 rmg-web-02 sshd[24301]: Failed password for invalid user git from 203.0.113.55 port 39629 ssh2
Aug 15 09:29:17 rmg-web-02 sshd[24301]: Connection closed by invalid user git 203.0.113.55 port 39629 [preauth]
Aug 15 09:29:22 rmg-web-02 sshd[24302]: Invalid user deploy from 203.0.113.55 port 36245
Aug 15 09:29:23 rmg-web-02 sshd[24302]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:29:23 rmg-web-02 sshd[24302]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:29:25 rmg-web-02 sshd[24302]: Failed password for invalid user deploy from 203.0.113.55 port 36245 ssh2
Aug 15 09:29:26 rmg-web-02 sshd[24302]: Connection closed by invalid user deploy 203.0.113.55 port 36245 [preauth]
Aug 15 09:29:26 rmg-web-02 sshd[24305]: Invalid user git from 203.0.113.55 port 60877
Aug 15 09:29:27 rmg-web-02 sshd[24305]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:29:27 rmg-web-02 sshd[24305]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:29:29 rmg-web-02 sshd[24305]: Failed password for invalid user git from 203.0.113.55 port 60877 ssh2
Aug 15 09:29:30 rmg-web-02 sshd[24305]: Connection closed by invalid user git 203.0.113.55 port 60877 [preauth]
Aug 15 09:29:36 rmg-web-02 sshd[24306]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:29:38 rmg-web-02 sshd[24306]: Failed password for postgres from 203.0.113.55 port 30456 ssh2
Aug 15 09:29:42 rmg-web-02 sshd[24307]: Invalid user ubuntu from 203.0.113.55 port 36133
Aug 15 09:29:43 rmg-web-02 sshd[24307]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:29:43 rmg-web-02 sshd[24307]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:29:45 rmg-web-02 sshd[24307]: Failed password for invalid user ubuntu from 203.0.113.55 port 36133 ssh2
Aug 15 09:29:45 rmg-web-02 sshd[24314]: Invalid user deploy from 203.0.113.55 port 43917
Aug 15 09:29:46 rmg-web-02 sshd[24307]: Connection closed by invalid user ubuntu 203.0.113.55 port 36133 [preauth]
Aug 15 09:29:46 rmg-web-02 sshd[24314]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:29:46 rmg-web-02 sshd[24314]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:29:48 rmg-web-02 sshd[24314]: Failed password for invalid user deploy from 203.0.113.55 port 43917 ssh2
Aug 15 09:29:49 rmg-web-02 sshd[24314]: Connection closed by invalid user deploy 203.0.113.55 port 43917 [preauth]
Aug 15 09:29:49 rmg-web-02 sshd[24319]: Invalid user test from 203.0.113.55 port 41443
Aug 15 09:29:50 rmg-web-02 sshd[24319]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:29:50 rmg-web-02 sshd[24319]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:29:52 rmg-web-02 sshd[24319]: Failed password for invalid user test from 203.0.113.55 port 41443 ssh2
Aug 15 09:29:53 rmg-web-02 sshd[24319]: Connection closed by invalid user test 203.0.113.55 port 41443 [preauth]
Aug 15 09:30:00 rmg-web-02 sshd[24323]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=testuser
Aug 15 09:30:02 rmg-web-02 sshd[24323]: Failed password for testuser from 203.0.113.55 port 40182 ssh2
Aug 15 09:30:05 rmg-web-02 sshd[22039]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 09:30:07 rmg-web-02 sshd[22039]: Failed password for nagios from 10.20.9.40 port 44213 ssh2
Aug 15 09:30:07 rmg-web-02 sshd[24324]: Invalid user ubuntu from 203.0.113.55 port 32589
Aug 15 09:30:08 rmg-web-02 sshd[24324]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:30:08 rmg-web-02 sshd[24324]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:30:10 rmg-web-02 sshd[24324]: Failed password for invalid user ubuntu from 203.0.113.55 port 32589 ssh2
Aug 15 09:30:10 rmg-web-02 sshd[24328]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=testuser
Aug 15 09:30:11 rmg-web-02 sshd[24324]: Connection closed by invalid user ubuntu 203.0.113.55 port 32589 [preauth]
Aug 15 09:30:12 rmg-web-02 sshd[24328]: Failed password for testuser from 203.0.113.55 port 57812 ssh2
Aug 15 09:30:16 rmg-web-02 sshd[24335]: Invalid user admin from 198.51.100.77 port 41717
Aug 15 09:30:17 rmg-web-02 sshd[24335]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:30:17 rmg-web-02 sshd[24335]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:30:19 rmg-web-02 sshd[24335]: Failed password for invalid user admin from 198.51.100.77 port 41717 ssh2
Aug 15 09:30:20 rmg-web-02 sshd[24335]: Connection closed by invalid user admin 198.51.100.77 port 41717 [preauth]
Aug 15 09:30:23 rmg-web-02 sshd[24338]: Invalid user git from 203.0.113.12 port 53625
Aug 15 09:30:24 rmg-web-02 sshd[24338]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:30:24 rmg-web-02 sshd[24338]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:30:26 rmg-web-02 sshd[24338]: Failed password for invalid user git from 203.0.113.12 port 53625 ssh2
Aug 15 09:30:27 rmg-web-02 sshd[24338]: Connection closed by invalid user git 203.0.113.12 port 53625 [preauth]
Aug 15 09:30:28 rmg-web-02 sshd[24344]: Invalid user ubuntu from 203.0.113.88 port 58406
Aug 15 09:30:29 rmg-web-02 sshd[24344]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:30:29 rmg-web-02 sshd[24344]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:30:31 rmg-web-02 sshd[24344]: Failed password for invalid user ubuntu from 203.0.113.88 port 58406 ssh2
Aug 15 09:30:32 rmg-web-02 sshd[24344]: Connection closed by invalid user ubuntu 203.0.113.88 port 58406 [preauth]
Aug 15 09:30:35 rmg-web-02 sshd[24353]: Invalid user ubuntu from 203.0.113.55 port 41535
Aug 15 09:30:36 rmg-web-02 sshd[24353]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:30:36 rmg-web-02 sshd[24353]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:30:38 rmg-web-02 sshd[24353]: Failed password for invalid user ubuntu from 203.0.113.55 port 41535 ssh2
Aug 15 09:30:39 rmg-web-02 sshd[24353]: Connection closed by invalid user ubuntu 203.0.113.55 port 41535 [preauth]
Aug 15 09:30:39 rmg-web-02 sshd[24356]: Invalid user deploy from 203.0.113.55 port 54850
Aug 15 09:30:40 rmg-web-02 sshd[24356]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:30:40 rmg-web-02 sshd[24356]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:30:42 rmg-web-02 sshd[24356]: Failed password for invalid user deploy from 203.0.113.55 port 54850 ssh2
Aug 15 09:30:43 rmg-web-02 sshd[24356]: Connection closed by invalid user deploy 203.0.113.55 port 54850 [preauth]
Aug 15 09:30:50 rmg-web-02 sshd[24362]: Invalid user ubuntu from 203.0.113.55 port 63156
Aug 15 09:30:51 rmg-web-02 sshd[24362]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:30:51 rmg-web-02 sshd[24362]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:30:53 rmg-web-02 sshd[24362]: Failed password for invalid user ubuntu from 203.0.113.55 port 63156 ssh2
Aug 15 09:30:54 rmg-web-02 sshd[24362]: Connection closed by invalid user ubuntu 203.0.113.55 port 63156 [preauth]
Aug 15 09:30:58 rmg-web-02 sshd[24370]: Invalid user ubuntu from 203.0.113.55 port 57537
Aug 15 09:30:59 rmg-web-02 sshd[24370]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:30:59 rmg-web-02 sshd[24370]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:31:01 rmg-web-02 sshd[24370]: Failed password for invalid user ubuntu from 203.0.113.55 port 57537 ssh2
Aug 15 09:31:02 rmg-web-02 sshd[24370]: Connection closed by invalid user ubuntu 203.0.113.55 port 57537 [preauth]
Aug 15 09:31:09 rmg-web-02 sshd[24371]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:31:11 rmg-web-02 sshd[24371]: Failed password for postgres from 203.0.113.55 port 30522 ssh2
Aug 15 09:31:17 rmg-web-02 sshd[24376]: Invalid user oracle from 203.0.113.88 port 44820
Aug 15 09:31:18 rmg-web-02 sshd[24376]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:31:18 rmg-web-02 sshd[24376]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:31:20 rmg-web-02 sshd[24376]: Failed password for invalid user oracle from 203.0.113.88 port 44820 ssh2
Aug 15 09:31:21 rmg-web-02 sshd[24376]: Connection closed by invalid user oracle 203.0.113.88 port 44820 [preauth]
Aug 15 09:31:26 rmg-web-02 sshd[24380]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=testuser
Aug 15 09:31:28 rmg-web-02 sshd[24380]: Failed password for testuser from 203.0.113.88 port 55195 ssh2
Aug 15 09:31:33 rmg-web-02 sshd[24384]: Invalid user admin from 198.51.100.77 port 55967
Aug 15 09:31:34 rmg-web-02 sshd[24384]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:31:34 rmg-web-02 sshd[24384]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:31:36 rmg-web-02 sshd[24384]: Failed password for invalid user admin from 198.51.100.77 port 55967 ssh2
Aug 15 09:31:37 rmg-web-02 sshd[24384]: Connection closed by invalid user admin 198.51.100.77 port 55967 [preauth]
Aug 15 09:31:39 rmg-web-02 sshd[24393]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=testuser
Aug 15 09:31:41 rmg-web-02 sshd[24393]: Failed password for testuser from 203.0.113.55 port 56276 ssh2
Aug 15 09:31:42 rmg-web-02 sshd[24395]: Invalid user git from 203.0.113.55 port 58726
Aug 15 09:31:43 rmg-web-02 sshd[24395]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:31:43 rmg-web-02 sshd[24395]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:31:45 rmg-web-02 sshd[24395]: Failed password for invalid user git from 203.0.113.55 port 58726 ssh2
Aug 15 09:31:46 rmg-web-02 sshd[24395]: Connection closed by invalid user git 203.0.113.55 port 58726 [preauth]
Aug 15 09:31:46 rmg-web-02 sshd[24402]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=root
Aug 15 09:31:48 rmg-web-02 sshd[24402]: Failed password for root from 203.0.113.88 port 35294 ssh2
Aug 15 09:31:53 rmg-web-02 sshd[24406]: Invalid user ubuntu from 203.0.113.55 port 38174
Aug 15 09:31:54 rmg-web-02 sshd[24406]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:31:54 rmg-web-02 sshd[24406]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:31:56 rmg-web-02 sshd[24406]: Failed password for invalid user ubuntu from 203.0.113.55 port 38174 ssh2
Aug 15 09:31:57 rmg-web-02 sshd[24406]: Connection closed by invalid user ubuntu 203.0.113.55 port 38174 [preauth]
Aug 15 09:32:01 rmg-web-02 sshd[24410]: Invalid user oracle from 203.0.113.12 port 46021
Aug 15 09:32:02 rmg-web-02 sshd[24410]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:32:02 rmg-web-02 sshd[24410]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:32:04 rmg-web-02 sshd[24410]: Failed password for invalid user oracle from 203.0.113.12 port 46021 ssh2
Aug 15 09:32:05 rmg-web-02 sshd[24410]: Connection closed by invalid user oracle 203.0.113.12 port 46021 [preauth]
Aug 15 09:32:07 rmg-web-02 sshd[24411]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=root
Aug 15 09:32:09 rmg-web-02 sshd[24411]: Failed password for root from 203.0.113.55 port 35480 ssh2
Aug 15 09:32:12 rmg-web-02 sshd[24416]: Invalid user git from 203.0.113.55 port 35932
Aug 15 09:32:13 rmg-web-02 sshd[24416]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:32:13 rmg-web-02 sshd[24416]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:32:15 rmg-web-02 sshd[24416]: Failed password for invalid user git from 203.0.113.55 port 35932 ssh2
Aug 15 09:32:16 rmg-web-02 sshd[24416]: Connection closed by invalid user git 203.0.113.55 port 35932 [preauth]
Aug 15 09:32:18 rmg-web-02 sshd[24425]: Invalid user test from 198.51.100.77 port 35073
Aug 15 09:32:19 rmg-web-02 sshd[24425]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:32:19 rmg-web-02 sshd[24425]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:32:21 rmg-web-02 sshd[24425]: Failed password for invalid user test from 198.51.100.77 port 35073 ssh2
Aug 15 09:32:22 rmg-web-02 sshd[24425]: Connection closed by invalid user test 198.51.100.77 port 35073 [preauth]
Aug 15 09:32:27 rmg-web-02 sshd[24430]: Invalid user oracle from 203.0.113.55 port 31384
Aug 15 09:32:28 rmg-web-02 sshd[24430]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:32:28 rmg-web-02 sshd[24430]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:32:30 rmg-web-02 sshd[24430]: Failed password for invalid user oracle from 203.0.113.55 port 31384 ssh2
Aug 15 09:32:31 rmg-web-02 sshd[24430]: Connection closed by invalid user oracle 203.0.113.55 port 31384 [preauth]
Aug 15 09:32:36 rmg-web-02 sshd[24435]: Invalid user oracle from 203.0.113.88 port 44426
Aug 15 09:32:37 rmg-web-02 sshd[24435]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:32:37 rmg-web-02 sshd[24435]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:32:39 rmg-web-02 sshd[24435]: Failed password for invalid user oracle from 203.0.113.88 port 44426 ssh2
Aug 15 09:32:40 rmg-web-02 sshd[24435]: Connection closed by invalid user oracle 203.0.113.88 port 44426 [preauth]
Aug 15 09:32:47 rmg-web-02 sshd[24444]: Invalid user test from 203.0.113.88 port 55400
Aug 15 09:32:48 rmg-web-02 sshd[24444]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:32:48 rmg-web-02 sshd[24444]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:32:50 rmg-web-02 sshd[24444]: Failed password for invalid user test from 203.0.113.88 port 55400 ssh2
Aug 15 09:32:51 rmg-web-02 sshd[24444]: Connection closed by invalid user test 203.0.113.88 port 55400 [preauth]
Aug 15 09:32:57 rmg-web-02 sshd[24446]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77  user=postgres
Aug 15 09:32:59 rmg-web-02 sshd[24446]: Failed password for postgres from 198.51.100.77 port 57887 ssh2
Aug 15 09:33:00 rmg-web-02 sshd[24451]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=root
Aug 15 09:33:02 rmg-web-02 sshd[24451]: Failed password for root from 203.0.113.55 port 55565 ssh2
Aug 15 09:33:09 rmg-web-02 sshd[24454]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=root
Aug 15 09:33:11 rmg-web-02 sshd[24454]: Failed password for root from 203.0.113.88 port 35893 ssh2
Aug 15 09:33:14 rmg-web-02 sshd[24461]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=testuser
Aug 15 09:33:16 rmg-web-02 sshd[24461]: Failed password for testuser from 203.0.113.88 port 59703 ssh2
Aug 15 09:33:19 rmg-web-02 sshd[24462]: Invalid user ubuntu from 203.0.113.55 port 41264
Aug 15 09:33:20 rmg-web-02 sshd[24462]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:33:20 rmg-web-02 sshd[24462]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:33:22 rmg-web-02 sshd[24462]: Failed password for invalid user ubuntu from 203.0.113.55 port 41264 ssh2
Aug 15 09:33:23 rmg-web-02 sshd[24462]: Connection closed by invalid user ubuntu 203.0.113.55 port 41264 [preauth]
Aug 15 09:33:29 rmg-web-02 sshd[24467]: Invalid user git from 203.0.113.55 port 40148
Aug 15 09:33:30 rmg-web-02 sshd[24467]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:33:30 rmg-web-02 sshd[24467]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:33:32 rmg-web-02 sshd[24467]: Failed password for invalid user git from 203.0.113.55 port 40148 ssh2
Aug 15 09:33:33 rmg-web-02 sshd[24467]: Connection closed by invalid user git 203.0.113.55 port 40148 [preauth]
Aug 15 09:33:37 rmg-web-02 sshd[24471]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=root
Aug 15 09:33:39 rmg-web-02 sshd[24471]: Failed password for root from 203.0.113.55 port 47376 ssh2
Aug 15 09:33:47 rmg-web-02 sshd[24478]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=testuser
Aug 15 09:33:49 rmg-web-02 sshd[24478]: Failed password for testuser from 203.0.113.55 port 63057 ssh2
Aug 15 09:33:57 rmg-web-02 sshd[24483]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:33:59 rmg-web-02 sshd[24483]: Failed password for postgres from 203.0.113.55 port 53439 ssh2
Aug 15 09:34:05 rmg-web-02 sshd[24490]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=testuser
Aug 15 09:34:07 rmg-web-02 sshd[24490]: Failed password for testuser from 203.0.113.55 port 54301 ssh2
Aug 15 09:34:10 rmg-web-02 sshd[24492]: Invalid user deploy from 203.0.113.88 port 34417
Aug 15 09:34:11 rmg-web-02 sshd[24492]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:34:11 rmg-web-02 sshd[24492]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:34:13 rmg-web-02 sshd[24492]: Failed password for invalid user deploy from 203.0.113.88 port 34417 ssh2
Aug 15 09:34:14 rmg-web-02 sshd[24492]: Connection closed by invalid user deploy 203.0.113.88 port 34417 [preauth]
Aug 15 09:34:20 rmg-web-02 sshd[24498]: Invalid user deploy from 203.0.113.55 port 44093
Aug 15 09:34:21 rmg-web-02 sshd[24498]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:34:21 rmg-web-02 sshd[24498]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:34:23 rmg-web-02 sshd[24498]: Failed password for invalid user deploy from 203.0.113.55 port 44093 ssh2
Aug 15 09:34:24 rmg-web-02 sshd[24498]: Connection closed by invalid user deploy 203.0.113.55 port 44093 [preauth]
Aug 15 09:34:26 rmg-web-02 sshd[24500]: Invalid user deploy from 203.0.113.88 port 49692
Aug 15 09:34:27 rmg-web-02 sshd[24500]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:34:27 rmg-web-02 sshd[24500]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:34:29 rmg-web-02 sshd[24500]: Failed password for invalid user deploy from 203.0.113.88 port 49692 ssh2
Aug 15 09:34:30 rmg-web-02 sshd[24500]: Connection closed by invalid user deploy 203.0.113.88 port 49692 [preauth]
Aug 15 09:34:31 rmg-web-02 sshd[24501]: Invalid user test from 203.0.113.88 port 35319
Aug 15 09:34:32 rmg-web-02 sshd[24501]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:34:32 rmg-web-02 sshd[24501]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:34:34 rmg-web-02 sshd[24501]: Failed password for invalid user test from 203.0.113.88 port 35319 ssh2
Aug 15 09:34:35 rmg-web-02 sshd[24501]: Connection closed by invalid user test 203.0.113.88 port 35319 [preauth]
Aug 15 09:34:35 rmg-web-02 sshd[24507]: Invalid user ubuntu from 203.0.113.55 port 33449
Aug 15 09:34:36 rmg-web-02 sshd[24507]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:34:36 rmg-web-02 sshd[24507]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:34:38 rmg-web-02 sshd[24507]: Failed password for invalid user ubuntu from 203.0.113.55 port 33449 ssh2
Aug 15 09:34:39 rmg-web-02 sshd[24507]: Connection closed by invalid user ubuntu 203.0.113.55 port 33449 [preauth]
Aug 15 09:34:46 rmg-web-02 sshd[24509]: Invalid user deploy from 203.0.113.55 port 50148
Aug 15 09:34:47 rmg-web-02 sshd[24509]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:34:47 rmg-web-02 sshd[24509]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:34:49 rmg-web-02 sshd[24509]: Failed password for invalid user deploy from 203.0.113.55 port 50148 ssh2
Aug 15 09:34:50 rmg-web-02 sshd[24509]: Connection closed by invalid user deploy 203.0.113.55 port 50148 [preauth]
Aug 15 09:34:55 rmg-web-02 sshd[24512]: Invalid user ubuntu from 203.0.113.55 port 32053
Aug 15 09:34:56 rmg-web-02 sshd[24512]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:34:56 rmg-web-02 sshd[24512]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:34:58 rmg-web-02 sshd[24512]: Failed password for invalid user ubuntu from 203.0.113.55 port 32053 ssh2
Aug 15 09:34:59 rmg-web-02 sshd[24512]: Connection closed by invalid user ubuntu 203.0.113.55 port 32053 [preauth]
Aug 15 09:35:05 rmg-web-02 sshd[24515]: Invalid user deploy from 203.0.113.55 port 43054
Aug 15 09:35:06 rmg-web-02 sshd[24515]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:35:06 rmg-web-02 sshd[24515]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:35:08 rmg-web-02 sshd[24515]: Failed password for invalid user deploy from 203.0.113.55 port 43054 ssh2
Aug 15 09:35:09 rmg-web-02 sshd[24515]: Connection closed by invalid user deploy 203.0.113.55 port 43054 [preauth]
Aug 15 09:35:14 rmg-web-02 sshd[24523]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:35:15 rmg-web-02 sshd[22046]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 09:35:16 rmg-web-02 sshd[24523]: Failed password for postgres from 203.0.113.55 port 33714 ssh2
Aug 15 09:35:17 rmg-web-02 sshd[22046]: Failed password for nagios from 10.20.9.40 port 51699 ssh2
Aug 15 09:35:19 rmg-web-02 sshd[24531]: Invalid user test from 203.0.113.55 port 55099
Aug 15 09:35:20 rmg-web-02 sshd[24531]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:35:20 rmg-web-02 sshd[24531]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:35:22 rmg-web-02 sshd[24531]: Failed password for invalid user test from 203.0.113.55 port 55099 ssh2
Aug 15 09:35:23 rmg-web-02 sshd[24531]: Connection closed by invalid user test 203.0.113.55 port 55099 [preauth]
Aug 15 09:35:29 rmg-web-02 sshd[24538]: Invalid user oracle from 203.0.113.55 port 43364
Aug 15 09:35:30 rmg-web-02 sshd[24538]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:35:30 rmg-web-02 sshd[24538]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:35:32 rmg-web-02 sshd[24538]: Failed password for invalid user oracle from 203.0.113.55 port 43364 ssh2
Aug 15 09:35:33 rmg-web-02 sshd[24538]: Connection closed by invalid user oracle 203.0.113.55 port 43364 [preauth]
Aug 15 09:35:39 rmg-web-02 sshd[24544]: Invalid user test from 203.0.113.55 port 43944
Aug 15 09:35:40 rmg-web-02 sshd[24544]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:35:40 rmg-web-02 sshd[24544]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:35:42 rmg-web-02 sshd[24544]: Failed password for invalid user test from 203.0.113.55 port 43944 ssh2
Aug 15 09:35:43 rmg-web-02 sshd[24544]: Connection closed by invalid user test 203.0.113.55 port 43944 [preauth]
Aug 15 09:35:45 rmg-web-02 sshd[24545]: Invalid user test from 203.0.113.12 port 53014
Aug 15 09:35:46 rmg-web-02 sshd[24545]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:35:46 rmg-web-02 sshd[24545]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:35:48 rmg-web-02 sshd[24545]: Failed password for invalid user test from 203.0.113.12 port 53014 ssh2
Aug 15 09:35:49 rmg-web-02 sshd[24545]: Connection closed by invalid user test 203.0.113.12 port 53014 [preauth]
Aug 15 09:35:49 rmg-web-02 sshd[24546]: Invalid user git from 203.0.113.55 port 35017
Aug 15 09:35:50 rmg-web-02 sshd[24546]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:35:50 rmg-web-02 sshd[24546]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:35:52 rmg-web-02 sshd[24546]: Failed password for invalid user git from 203.0.113.55 port 35017 ssh2
Aug 15 09:35:53 rmg-web-02 sshd[24546]: Connection closed by invalid user git 203.0.113.55 port 35017 [preauth]
Aug 15 09:35:53 rmg-web-02 sshd[24555]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=root
Aug 15 09:35:55 rmg-web-02 sshd[24555]: Failed password for root from 203.0.113.12 port 44678 ssh2
Aug 15 09:35:59 rmg-web-02 sshd[24556]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=root
Aug 15 09:36:01 rmg-web-02 sshd[24556]: Failed password for root from 203.0.113.55 port 57080 ssh2
Aug 15 09:36:03 rmg-web-02 sshd[24564]: Invalid user admin from 203.0.113.88 port 30151
Aug 15 09:36:04 rmg-web-02 sshd[24564]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:36:04 rmg-web-02 sshd[24564]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:36:06 rmg-web-02 sshd[24564]: Failed password for invalid user admin from 203.0.113.88 port 30151 ssh2
Aug 15 09:36:07 rmg-web-02 sshd[24564]: Connection closed by invalid user admin 203.0.113.88 port 30151 [preauth]
Aug 15 09:36:12 rmg-web-02 sshd[24570]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=root
Aug 15 09:36:14 rmg-web-02 sshd[24570]: Failed password for root from 203.0.113.55 port 64113 ssh2
Aug 15 09:36:23 rmg-web-02 sshd[24574]: Invalid user test from 203.0.113.12 port 49857
Aug 15 09:36:24 rmg-web-02 sshd[24574]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:36:24 rmg-web-02 sshd[24574]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:36:26 rmg-web-02 sshd[24574]: Failed password for invalid user test from 203.0.113.12 port 49857 ssh2
Aug 15 09:36:27 rmg-web-02 sshd[24574]: Connection closed by invalid user test 203.0.113.12 port 49857 [preauth]
Aug 15 09:36:34 rmg-web-02 sshd[24576]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=testuser
Aug 15 09:36:36 rmg-web-02 sshd[24576]: Failed password for testuser from 203.0.113.55 port 57154 ssh2
Aug 15 09:36:44 rmg-web-02 sshd[24584]: Invalid user git from 203.0.113.88 port 51522
Aug 15 09:36:45 rmg-web-02 sshd[24584]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:36:45 rmg-web-02 sshd[24584]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:36:47 rmg-web-02 sshd[24584]: Failed password for invalid user git from 203.0.113.88 port 51522 ssh2
Aug 15 09:36:48 rmg-web-02 sshd[24584]: Connection closed by invalid user git 203.0.113.88 port 51522 [preauth]
Aug 15 09:36:50 rmg-web-02 sshd[24586]: Invalid user git from 198.51.100.77 port 41729
Aug 15 09:36:51 rmg-web-02 sshd[24586]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:36:51 rmg-web-02 sshd[24586]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:36:53 rmg-web-02 sshd[24586]: Failed password for invalid user git from 198.51.100.77 port 41729 ssh2
Aug 15 09:36:54 rmg-web-02 sshd[24586]: Connection closed by invalid user git 198.51.100.77 port 41729 [preauth]
Aug 15 09:36:57 rmg-web-02 sshd[24590]: Invalid user admin from 203.0.113.55 port 45427
Aug 15 09:36:58 rmg-web-02 sshd[24590]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:36:58 rmg-web-02 sshd[24590]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:37:00 rmg-web-02 sshd[24590]: Failed password for invalid user admin from 203.0.113.55 port 45427 ssh2
Aug 15 09:37:01 rmg-web-02 sshd[24590]: Connection closed by invalid user admin 203.0.113.55 port 45427 [preauth]
Aug 15 09:37:01 rmg-web-02 sshd[24599]: Invalid user ubuntu from 198.51.100.77 port 61894
Aug 15 09:37:02 rmg-web-02 sshd[24599]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:37:02 rmg-web-02 sshd[24599]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:37:04 rmg-web-02 sshd[24599]: Failed password for invalid user ubuntu from 198.51.100.77 port 61894 ssh2
Aug 15 09:37:05 rmg-web-02 sshd[24599]: Connection closed by invalid user ubuntu 198.51.100.77 port 61894 [preauth]
Aug 15 09:37:05 rmg-web-02 sshd[24604]: Invalid user git from 203.0.113.55 port 62351
Aug 15 09:37:06 rmg-web-02 sshd[24604]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:37:06 rmg-web-02 sshd[24604]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:37:08 rmg-web-02 sshd[24604]: Failed password for invalid user git from 203.0.113.55 port 62351 ssh2
Aug 15 09:37:09 rmg-web-02 sshd[24604]: Connection closed by invalid user git 203.0.113.55 port 62351 [preauth]
Aug 15 09:37:09 rmg-web-02 sshd[24610]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77  user=testuser
Aug 15 09:37:11 rmg-web-02 sshd[24610]: Failed password for testuser from 198.51.100.77 port 45095 ssh2
Aug 15 09:37:12 rmg-web-02 sshd[24618]: Invalid user admin from 203.0.113.55 port 58842
Aug 15 09:37:13 rmg-web-02 sshd[24618]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:37:13 rmg-web-02 sshd[24618]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:37:15 rmg-web-02 sshd[24618]: Failed password for invalid user admin from 203.0.113.55 port 58842 ssh2
Aug 15 09:37:16 rmg-web-02 sshd[24618]: Connection closed by invalid user admin 203.0.113.55 port 58842 [preauth]
Aug 15 09:37:19 rmg-web-02 sshd[24623]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77  user=postgres
Aug 15 09:37:21 rmg-web-02 sshd[24623]: Failed password for postgres from 198.51.100.77 port 53588 ssh2
Aug 15 09:37:22 rmg-web-02 sshd[24632]: Invalid user admin from 203.0.113.55 port 32146
Aug 15 09:37:23 rmg-web-02 sshd[24632]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:37:23 rmg-web-02 sshd[24632]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:37:25 rmg-web-02 sshd[24632]: Failed password for invalid user admin from 203.0.113.55 port 32146 ssh2
Aug 15 09:37:26 rmg-web-02 sshd[24632]: Connection closed by invalid user admin 203.0.113.55 port 32146 [preauth]
Aug 15 09:37:27 rmg-web-02 sshd[24641]: Invalid user oracle from 203.0.113.55 port 41565
Aug 15 09:37:28 rmg-web-02 sshd[24641]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:37:28 rmg-web-02 sshd[24641]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:37:30 rmg-web-02 sshd[24641]: Failed password for invalid user oracle from 203.0.113.55 port 41565 ssh2
Aug 15 09:37:31 rmg-web-02 sshd[24641]: Connection closed by invalid user oracle 203.0.113.55 port 41565 [preauth]
Aug 15 09:37:35 rmg-web-02 sshd[24649]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:37:37 rmg-web-02 sshd[24649]: Failed password for postgres from 203.0.113.55 port 31099 ssh2
Aug 15 09:37:40 rmg-web-02 sshd[24655]: Invalid user deploy from 203.0.113.55 port 43617
Aug 15 09:37:41 rmg-web-02 sshd[24655]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:37:41 rmg-web-02 sshd[24655]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:37:43 rmg-web-02 sshd[24655]: Failed password for invalid user deploy from 203.0.113.55 port 43617 ssh2
Aug 15 09:37:43 rmg-web-02 sshd[24656]: Invalid user test from 198.51.100.77 port 33492
Aug 15 09:37:44 rmg-web-02 sshd[24655]: Connection closed by invalid user deploy 203.0.113.55 port 43617 [preauth]
Aug 15 09:37:44 rmg-web-02 sshd[24656]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:37:44 rmg-web-02 sshd[24656]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:37:46 rmg-web-02 sshd[24656]: Failed password for invalid user test from 198.51.100.77 port 33492 ssh2
Aug 15 09:37:47 rmg-web-02 sshd[24656]: Connection closed by invalid user test 198.51.100.77 port 33492 [preauth]
Aug 15 09:37:53 rmg-web-02 sshd[24659]: Invalid user oracle from 203.0.113.55 port 54407
Aug 15 09:37:54 rmg-web-02 sshd[24659]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:37:54 rmg-web-02 sshd[24659]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:37:56 rmg-web-02 sshd[24659]: Failed password for invalid user oracle from 203.0.113.55 port 54407 ssh2
Aug 15 09:37:57 rmg-web-02 sshd[24659]: Connection closed by invalid user oracle 203.0.113.55 port 54407 [preauth]
Aug 15 09:37:59 rmg-web-02 sshd[24664]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=root
Aug 15 09:38:01 rmg-web-02 sshd[24664]: Failed password for root from 203.0.113.55 port 39960 ssh2
Aug 15 09:38:06 rmg-web-02 sshd[24670]: Invalid user git from 203.0.113.88 port 35947
Aug 15 09:38:07 rmg-web-02 sshd[24670]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:38:07 rmg-web-02 sshd[24670]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:38:09 rmg-web-02 sshd[24670]: Failed password for invalid user git from 203.0.113.88 port 35947 ssh2
Aug 15 09:38:09 rmg-web-02 sshd[24678]: Invalid user deploy from 203.0.113.55 port 61532
Aug 15 09:38:10 rmg-web-02 sshd[24670]: Connection closed by invalid user git 203.0.113.88 port 35947 [preauth]
Aug 15 09:38:10 rmg-web-02 sshd[24678]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:38:10 rmg-web-02 sshd[24678]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:38:12 rmg-web-02 sshd[24678]: Failed password for invalid user deploy from 203.0.113.55 port 61532 ssh2
Aug 15 09:38:13 rmg-web-02 sshd[24678]: Connection closed by invalid user deploy 203.0.113.55 port 61532 [preauth]
Aug 15 09:38:19 rmg-web-02 sshd[24684]: Invalid user oracle from 203.0.113.55 port 58459
Aug 15 09:38:20 rmg-web-02 sshd[24684]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:38:20 rmg-web-02 sshd[24684]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:38:22 rmg-web-02 sshd[24684]: Failed password for invalid user oracle from 203.0.113.55 port 58459 ssh2
Aug 15 09:38:23 rmg-web-02 sshd[24684]: Connection closed by invalid user oracle 203.0.113.55 port 58459 [preauth]
Aug 15 09:38:24 rmg-web-02 sshd[24688]: Invalid user deploy from 203.0.113.55 port 39538
Aug 15 09:38:25 rmg-web-02 sshd[24688]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:38:25 rmg-web-02 sshd[24688]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:38:27 rmg-web-02 sshd[24688]: Failed password for invalid user deploy from 203.0.113.55 port 39538 ssh2
Aug 15 09:38:27 rmg-web-02 sshd[24696]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=testuser
Aug 15 09:38:28 rmg-web-02 sshd[24688]: Connection closed by invalid user deploy 203.0.113.55 port 39538 [preauth]
Aug 15 09:38:29 rmg-web-02 sshd[24696]: Failed password for testuser from 203.0.113.55 port 33139 ssh2
Aug 15 09:38:32 rmg-web-02 sshd[24700]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=testuser
Aug 15 09:38:34 rmg-web-02 sshd[24700]: Failed password for testuser from 203.0.113.12 port 37121 ssh2
Aug 15 09:38:40 rmg-web-02 sshd[24708]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=testuser
Aug 15 09:38:42 rmg-web-02 sshd[24708]: Failed password for testuser from 203.0.113.55 port 35309 ssh2
Aug 15 09:38:45 rmg-web-02 sshd[24714]: Invalid user test from 203.0.113.55 port 50759
Aug 15 09:38:46 rmg-web-02 sshd[24714]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:38:46 rmg-web-02 sshd[24714]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:38:48 rmg-web-02 sshd[24714]: Failed password for invalid user test from 203.0.113.55 port 50759 ssh2
Aug 15 09:38:49 rmg-web-02 sshd[24714]: Connection closed by invalid user test 203.0.113.55 port 50759 [preauth]
Aug 15 09:38:56 rmg-web-02 sshd[24720]: Invalid user git from 198.51.100.77 port 43873
Aug 15 09:38:57 rmg-web-02 sshd[24720]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:38:57 rmg-web-02 sshd[24720]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:38:59 rmg-web-02 sshd[24720]: Failed password for invalid user git from 198.51.100.77 port 43873 ssh2
Aug 15 09:39:00 rmg-web-02 sshd[24720]: Connection closed by invalid user git 198.51.100.77 port 43873 [preauth]
Aug 15 09:39:06 rmg-web-02 sshd[24728]: Invalid user deploy from 203.0.113.88 port 31565
Aug 15 09:39:07 rmg-web-02 sshd[24728]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:39:07 rmg-web-02 sshd[24728]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:39:09 rmg-web-02 sshd[24728]: Failed password for invalid user deploy from 203.0.113.88 port 31565 ssh2
Aug 15 09:39:10 rmg-web-02 sshd[24728]: Connection closed by invalid user deploy 203.0.113.88 port 31565 [preauth]
Aug 15 09:39:10 rmg-web-02 sshd[24736]: Invalid user admin from 203.0.113.88 port 45633
Aug 15 09:39:11 rmg-web-02 sshd[24736]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:39:11 rmg-web-02 sshd[24736]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:39:13 rmg-web-02 sshd[24736]: Failed password for invalid user admin from 203.0.113.88 port 45633 ssh2
Aug 15 09:39:14 rmg-web-02 sshd[24736]: Connection closed by invalid user admin 203.0.113.88 port 45633 [preauth]
Aug 15 09:39:21 rmg-web-02 sshd[24738]: Invalid user test from 203.0.113.55 port 32835
Aug 15 09:39:22 rmg-web-02 sshd[24738]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:39:22 rmg-web-02 sshd[24738]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:39:24 rmg-web-02 sshd[24738]: Failed password for invalid user test from 203.0.113.55 port 32835 ssh2
Aug 15 09:39:25 rmg-web-02 sshd[24738]: Connection closed by invalid user test 203.0.113.55 port 32835 [preauth]
Aug 15 09:39:26 rmg-web-02 sshd[24740]: Invalid user test from 203.0.113.55 port 64308
Aug 15 09:39:27 rmg-web-02 sshd[24740]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:39:27 rmg-web-02 sshd[24740]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:39:29 rmg-web-02 sshd[24740]: Failed password for invalid user test from 203.0.113.55 port 64308 ssh2
Aug 15 09:39:30 rmg-web-02 sshd[24740]: Connection closed by invalid user test 203.0.113.55 port 64308 [preauth]
Aug 15 09:39:37 rmg-web-02 sshd[24749]: Invalid user admin from 198.51.100.77 port 30933
Aug 15 09:39:38 rmg-web-02 sshd[24749]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:39:38 rmg-web-02 sshd[24749]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:39:40 rmg-web-02 sshd[24749]: Failed password for invalid user admin from 198.51.100.77 port 30933 ssh2
Aug 15 09:39:41 rmg-web-02 sshd[24749]: Connection closed by invalid user admin 198.51.100.77 port 30933 [preauth]
Aug 15 09:39:42 rmg-web-02 sshd[24753]: Invalid user admin from 203.0.113.55 port 44487
Aug 15 09:39:43 rmg-web-02 sshd[24753]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:39:43 rmg-web-02 sshd[24753]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:39:45 rmg-web-02 sshd[24753]: Failed password for invalid user admin from 203.0.113.55 port 44487 ssh2
Aug 15 09:39:46 rmg-web-02 sshd[24753]: Connection closed by invalid user admin 203.0.113.55 port 44487 [preauth]
Aug 15 09:39:49 rmg-web-02 sshd[24755]: Invalid user git from 203.0.113.55 port 31981
Aug 15 09:39:50 rmg-web-02 sshd[24755]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:39:50 rmg-web-02 sshd[24755]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:39:52 rmg-web-02 sshd[24755]: Failed password for invalid user git from 203.0.113.55 port 31981 ssh2
Aug 15 09:39:53 rmg-web-02 sshd[24755]: Connection closed by invalid user git 203.0.113.55 port 31981 [preauth]
Aug 15 09:39:58 rmg-web-02 sshd[24763]: Invalid user oracle from 203.0.113.55 port 59564
Aug 15 09:39:59 rmg-web-02 sshd[24763]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:39:59 rmg-web-02 sshd[24763]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:40:01 rmg-web-02 sshd[24763]: Failed password for invalid user oracle from 203.0.113.55 port 59564 ssh2
Aug 15 09:40:02 rmg-web-02 sshd[24763]: Connection closed by invalid user oracle 203.0.113.55 port 59564 [preauth]
Aug 15 09:40:03 rmg-web-02 sshd[24770]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=testuser
Aug 15 09:40:05 rmg-web-02 sshd[24770]: Failed password for testuser from 203.0.113.12 port 64144 ssh2
Aug 15 09:40:06 rmg-web-02 sshd[24773]: Invalid user git from 203.0.113.12 port 43534
Aug 15 09:40:07 rmg-web-02 sshd[24773]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:40:07 rmg-web-02 sshd[24773]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:40:09 rmg-web-02 sshd[24773]: Failed password for invalid user git from 203.0.113.12 port 43534 ssh2
Aug 15 09:40:10 rmg-web-02 sshd[24773]: Connection closed by invalid user git 203.0.113.12 port 43534 [preauth]
Aug 15 09:40:17 rmg-web-02 sshd[22051]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 09:40:17 rmg-web-02 sshd[24781]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=testuser
Aug 15 09:40:19 rmg-web-02 sshd[22051]: Failed password for nagios from 10.20.9.40 port 51782 ssh2
Aug 15 09:40:19 rmg-web-02 sshd[24781]: Failed password for testuser from 203.0.113.55 port 40981 ssh2
Aug 15 09:40:22 rmg-web-02 sshd[24785]: Invalid user deploy from 203.0.113.88 port 31411
Aug 15 09:40:23 rmg-web-02 sshd[24785]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:40:23 rmg-web-02 sshd[24785]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:40:25 rmg-web-02 sshd[24785]: Failed password for invalid user deploy from 203.0.113.88 port 31411 ssh2
Aug 15 09:40:26 rmg-web-02 sshd[24785]: Connection closed by invalid user deploy 203.0.113.88 port 31411 [preauth]
Aug 15 09:40:28 rmg-web-02 sshd[24787]: Invalid user admin from 203.0.113.12 port 42657
Aug 15 09:40:29 rmg-web-02 sshd[24787]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:40:29 rmg-web-02 sshd[24787]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:40:31 rmg-web-02 sshd[24787]: Failed password for invalid user admin from 203.0.113.12 port 42657 ssh2
Aug 15 09:40:32 rmg-web-02 sshd[24787]: Connection closed by invalid user admin 203.0.113.12 port 42657 [preauth]
Aug 15 09:40:34 rmg-web-02 sshd[24789]: Invalid user git from 203.0.113.88 port 47325
Aug 15 09:40:35 rmg-web-02 sshd[24789]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:40:35 rmg-web-02 sshd[24789]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:40:37 rmg-web-02 sshd[24789]: Failed password for invalid user git from 203.0.113.88 port 47325 ssh2
Aug 15 09:40:38 rmg-web-02 sshd[24789]: Connection closed by invalid user git 203.0.113.88 port 47325 [preauth]
Aug 15 09:40:40 rmg-web-02 sshd[24797]: Invalid user ubuntu from 203.0.113.55 port 56567
Aug 15 09:40:41 rmg-web-02 sshd[24797]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:40:41 rmg-web-02 sshd[24797]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:40:43 rmg-web-02 sshd[24797]: Failed password for invalid user ubuntu from 203.0.113.55 port 56567 ssh2
Aug 15 09:40:44 rmg-web-02 sshd[24797]: Connection closed by invalid user ubuntu 203.0.113.55 port 56567 [preauth]
Aug 15 09:40:49 rmg-web-02 sshd[24803]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=root
Aug 15 09:40:51 rmg-web-02 sshd[24803]: Failed password for root from 203.0.113.55 port 42290 ssh2
Aug 15 09:41:00 rmg-web-02 sshd[24804]: Invalid user git from 203.0.113.55 port 34768
Aug 15 09:41:01 rmg-web-02 sshd[24804]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:41:01 rmg-web-02 sshd[24804]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:41:03 rmg-web-02 sshd[24804]: Failed password for invalid user git from 203.0.113.55 port 34768 ssh2
Aug 15 09:41:04 rmg-web-02 sshd[24804]: Connection closed by invalid user git 203.0.113.55 port 34768 [preauth]
Aug 15 09:41:07 rmg-web-02 sshd[24805]: Invalid user test from 203.0.113.55 port 30008
Aug 15 09:41:08 rmg-web-02 sshd[24805]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:41:08 rmg-web-02 sshd[24805]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:41:10 rmg-web-02 sshd[24805]: Failed password for invalid user test from 203.0.113.55 port 30008 ssh2
Aug 15 09:41:10 rmg-web-02 sshd[24807]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:41:11 rmg-web-02 sshd[24805]: Connection closed by invalid user test 203.0.113.55 port 30008 [preauth]
Aug 15 09:41:12 rmg-web-02 sshd[24807]: Failed password for postgres from 203.0.113.55 port 41058 ssh2
Aug 15 09:41:16 rmg-web-02 sshd[24809]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=testuser
Aug 15 09:41:18 rmg-web-02 sshd[24809]: Failed password for testuser from 203.0.113.55 port 44949 ssh2
Aug 15 09:41:21 rmg-web-02 sshd[24815]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77  user=postgres
Aug 15 09:41:23 rmg-web-02 sshd[24815]: Failed password for postgres from 198.51.100.77 port 53520 ssh2
Aug 15 09:41:25 rmg-web-02 sshd[24824]: Invalid user git from 203.0.113.55 port 47229
Aug 15 09:41:26 rmg-web-02 sshd[24824]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:41:26 rmg-web-02 sshd[24824]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:41:28 rmg-web-02 sshd[24824]: Failed password for invalid user git from 203.0.113.55 port 47229 ssh2
Aug 15 09:41:29 rmg-web-02 sshd[24824]: Connection closed by invalid user git 203.0.113.55 port 47229 [preauth]
Aug 15 09:41:29 rmg-web-02 sshd[24831]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=root
Aug 15 09:41:31 rmg-web-02 sshd[24831]: Failed password for root from 203.0.113.88 port 44117 ssh2
Aug 15 09:41:32 rmg-web-02 sshd[24832]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=root
Aug 15 09:41:34 rmg-web-02 sshd[24832]: Failed password for root from 203.0.113.88 port 54520 ssh2
Aug 15 09:41:43 rmg-web-02 sshd[24834]: Invalid user oracle from 203.0.113.55 port 56375
Aug 15 09:41:44 rmg-web-02 sshd[24834]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:41:44 rmg-web-02 sshd[24834]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:41:46 rmg-web-02 sshd[24834]: Failed password for invalid user oracle from 203.0.113.55 port 56375 ssh2
Aug 15 09:41:46 rmg-web-02 sshd[24842]: Invalid user test from 203.0.113.55 port 46662
Aug 15 09:41:47 rmg-web-02 sshd[24834]: Connection closed by invalid user oracle 203.0.113.55 port 56375 [preauth]
Aug 15 09:41:47 rmg-web-02 sshd[24842]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:41:47 rmg-web-02 sshd[24842]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:41:49 rmg-web-02 sshd[24842]: Failed password for invalid user test from 203.0.113.55 port 46662 ssh2
Aug 15 09:41:50 rmg-web-02 sshd[24842]: Connection closed by invalid user test 203.0.113.55 port 46662 [preauth]
Aug 15 09:41:54 rmg-web-02 sshd[24847]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=root
Aug 15 09:41:56 rmg-web-02 sshd[24847]: Failed password for root from 203.0.113.55 port 43637 ssh2
Aug 15 09:41:59 rmg-web-02 sshd[24850]: Invalid user git from 203.0.113.12 port 62709
Aug 15 09:42:00 rmg-web-02 sshd[24850]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:42:00 rmg-web-02 sshd[24850]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:42:02 rmg-web-02 sshd[24850]: Failed password for invalid user git from 203.0.113.12 port 62709 ssh2
Aug 15 09:42:03 rmg-web-02 sshd[24850]: Connection closed by invalid user git 203.0.113.12 port 62709 [preauth]
Aug 15 09:42:04 rmg-web-02 sshd[24852]: Invalid user admin from 203.0.113.55 port 38326
Aug 15 09:42:05 rmg-web-02 sshd[24852]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:42:05 rmg-web-02 sshd[24852]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:42:07 rmg-web-02 sshd[24852]: Failed password for invalid user admin from 203.0.113.55 port 38326 ssh2
Aug 15 09:42:07 rmg-web-02 sshd[24853]: Invalid user oracle from 203.0.113.55 port 37132
Aug 15 09:42:08 rmg-web-02 sshd[24852]: Connection closed by invalid user admin 203.0.113.55 port 38326 [preauth]
Aug 15 09:42:08 rmg-web-02 sshd[24853]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:42:08 rmg-web-02 sshd[24853]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:42:10 rmg-web-02 sshd[24853]: Failed password for invalid user oracle from 203.0.113.55 port 37132 ssh2
Aug 15 09:42:11 rmg-web-02 sshd[24853]: Connection closed by invalid user oracle 203.0.113.55 port 37132 [preauth]
Aug 15 09:42:13 rmg-web-02 sshd[24856]: Invalid user oracle from 198.51.100.77 port 59112
Aug 15 09:42:14 rmg-web-02 sshd[24856]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:42:14 rmg-web-02 sshd[24856]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:42:16 rmg-web-02 sshd[24856]: Failed password for invalid user oracle from 198.51.100.77 port 59112 ssh2
Aug 15 09:42:17 rmg-web-02 sshd[24856]: Connection closed by invalid user oracle 198.51.100.77 port 59112 [preauth]
Aug 15 09:42:22 rmg-web-02 sshd[24860]: Invalid user ubuntu from 198.51.100.77 port 60337
Aug 15 09:42:23 rmg-web-02 sshd[24860]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:42:23 rmg-web-02 sshd[24860]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:42:25 rmg-web-02 sshd[24860]: Failed password for invalid user ubuntu from 198.51.100.77 port 60337 ssh2
Aug 15 09:42:26 rmg-web-02 sshd[24860]: Connection closed by invalid user ubuntu 198.51.100.77 port 60337 [preauth]
Aug 15 09:42:28 rmg-web-02 sshd[24861]: Invalid user test from 203.0.113.55 port 49531
Aug 15 09:42:29 rmg-web-02 sshd[24861]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:42:29 rmg-web-02 sshd[24861]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:42:31 rmg-web-02 sshd[24861]: Failed password for invalid user test from 203.0.113.55 port 49531 ssh2
Aug 15 09:42:32 rmg-web-02 sshd[24861]: Connection closed by invalid user test 203.0.113.55 port 49531 [preauth]
Aug 15 09:42:36 rmg-web-02 sshd[24869]: Invalid user deploy from 203.0.113.55 port 42856
Aug 15 09:42:37 rmg-web-02 sshd[24869]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:42:37 rmg-web-02 sshd[24869]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:42:39 rmg-web-02 sshd[24869]: Failed password for invalid user deploy from 203.0.113.55 port 42856 ssh2
Aug 15 09:42:40 rmg-web-02 sshd[24869]: Connection closed by invalid user deploy 203.0.113.55 port 42856 [preauth]
Aug 15 09:42:43 rmg-web-02 sshd[24878]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=testuser
Aug 15 09:42:45 rmg-web-02 sshd[24878]: Failed password for testuser from 203.0.113.88 port 46291 ssh2
Aug 15 09:42:48 rmg-web-02 sshd[24884]: Invalid user git from 198.51.100.77 port 39256
Aug 15 09:42:49 rmg-web-02 sshd[24884]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:42:49 rmg-web-02 sshd[24884]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:42:51 rmg-web-02 sshd[24884]: Failed password for invalid user git from 198.51.100.77 port 39256 ssh2
Aug 15 09:42:52 rmg-web-02 sshd[24884]: Connection closed by invalid user git 198.51.100.77 port 39256 [preauth]
Aug 15 09:42:57 rmg-web-02 sshd[24891]: Invalid user admin from 203.0.113.88 port 58270
Aug 15 09:42:58 rmg-web-02 sshd[24891]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:42:58 rmg-web-02 sshd[24891]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:43:00 rmg-web-02 sshd[24891]: Failed password for invalid user admin from 203.0.113.88 port 58270 ssh2
Aug 15 09:43:01 rmg-web-02 sshd[24891]: Connection closed by invalid user admin 203.0.113.88 port 58270 [preauth]
Aug 15 09:43:06 rmg-web-02 sshd[24896]: Invalid user git from 203.0.113.55 port 42095
Aug 15 09:43:07 rmg-web-02 sshd[24896]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:43:07 rmg-web-02 sshd[24896]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:43:09 rmg-web-02 sshd[24896]: Failed password for invalid user git from 203.0.113.55 port 42095 ssh2
Aug 15 09:43:10 rmg-web-02 sshd[24896]: Connection closed by invalid user git 203.0.113.55 port 42095 [preauth]
Aug 15 09:43:10 rmg-web-02 sshd[24900]: Invalid user test from 203.0.113.55 port 55216
Aug 15 09:43:11 rmg-web-02 sshd[24900]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:43:11 rmg-web-02 sshd[24900]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:43:13 rmg-web-02 sshd[24900]: Failed password for invalid user test from 203.0.113.55 port 55216 ssh2
Aug 15 09:43:13 rmg-web-02 sshd[24901]: Invalid user ubuntu from 203.0.113.88 port 33679
Aug 15 09:43:14 rmg-web-02 sshd[24900]: Connection closed by invalid user test 203.0.113.55 port 55216 [preauth]
Aug 15 09:43:14 rmg-web-02 sshd[24901]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:43:14 rmg-web-02 sshd[24901]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:43:16 rmg-web-02 sshd[24901]: Failed password for invalid user ubuntu from 203.0.113.88 port 33679 ssh2
Aug 15 09:43:17 rmg-web-02 sshd[24901]: Connection closed by invalid user ubuntu 203.0.113.88 port 33679 [preauth]
Aug 15 09:43:22 rmg-web-02 sshd[24906]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=testuser
Aug 15 09:43:24 rmg-web-02 sshd[24906]: Failed password for testuser from 203.0.113.55 port 42984 ssh2
Aug 15 09:43:33 rmg-web-02 sshd[24910]: Invalid user oracle from 203.0.113.55 port 40945
Aug 15 09:43:34 rmg-web-02 sshd[24910]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:43:34 rmg-web-02 sshd[24910]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:43:36 rmg-web-02 sshd[24910]: Failed password for invalid user oracle from 203.0.113.55 port 40945 ssh2
Aug 15 09:43:37 rmg-web-02 sshd[24910]: Connection closed by invalid user oracle 203.0.113.55 port 40945 [preauth]
Aug 15 09:43:44 rmg-web-02 sshd[24914]: Invalid user oracle from 203.0.113.12 port 38635
Aug 15 09:43:45 rmg-web-02 sshd[24914]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:43:45 rmg-web-02 sshd[24914]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:43:47 rmg-web-02 sshd[24914]: Failed password for invalid user oracle from 203.0.113.12 port 38635 ssh2
Aug 15 09:43:48 rmg-web-02 sshd[24914]: Connection closed by invalid user oracle 203.0.113.12 port 38635 [preauth]
Aug 15 09:43:53 rmg-web-02 sshd[24921]: Invalid user ubuntu from 203.0.113.55 port 48997
Aug 15 09:43:54 rmg-web-02 sshd[24921]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:43:54 rmg-web-02 sshd[24921]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:43:56 rmg-web-02 sshd[24921]: Failed password for invalid user ubuntu from 203.0.113.55 port 48997 ssh2
Aug 15 09:43:56 rmg-web-02 sshd[24924]: Invalid user admin from 198.51.100.77 port 61578
Aug 15 09:43:57 rmg-web-02 sshd[24921]: Connection closed by invalid user ubuntu 203.0.113.55 port 48997 [preauth]
Aug 15 09:43:57 rmg-web-02 sshd[24924]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:43:57 rmg-web-02 sshd[24924]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:43:59 rmg-web-02 sshd[24924]: Failed password for invalid user admin from 198.51.100.77 port 61578 ssh2
Aug 15 09:44:00 rmg-web-02 sshd[24924]: Connection closed by invalid user admin 198.51.100.77 port 61578 [preauth]
Aug 15 09:44:07 rmg-web-02 sshd[24931]: Invalid user git from 198.51.100.77 port 47875
Aug 15 09:44:08 rmg-web-02 sshd[24931]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:44:08 rmg-web-02 sshd[24931]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:44:10 rmg-web-02 sshd[24931]: Failed password for invalid user git from 198.51.100.77 port 47875 ssh2
Aug 15 09:44:11 rmg-web-02 sshd[24931]: Connection closed by invalid user git 198.51.100.77 port 47875 [preauth]
Aug 15 09:44:16 rmg-web-02 sshd[24936]: Invalid user deploy from 198.51.100.77 port 64087
Aug 15 09:44:17 rmg-web-02 sshd[24936]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:44:17 rmg-web-02 sshd[24936]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:44:19 rmg-web-02 sshd[24936]: Failed password for invalid user deploy from 198.51.100.77 port 64087 ssh2
Aug 15 09:44:20 rmg-web-02 sshd[24936]: Connection closed by invalid user deploy 198.51.100.77 port 64087 [preauth]
Aug 15 09:44:21 rmg-web-02 sshd[24943]: Invalid user oracle from 203.0.113.55 port 60644
Aug 15 09:44:22 rmg-web-02 sshd[24943]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:44:22 rmg-web-02 sshd[24943]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:44:24 rmg-web-02 sshd[24943]: Failed password for invalid user oracle from 203.0.113.55 port 60644 ssh2
Aug 15 09:44:25 rmg-web-02 sshd[24943]: Connection closed by invalid user oracle 203.0.113.55 port 60644 [preauth]
Aug 15 09:44:29 rmg-web-02 sshd[24951]: Invalid user git from 203.0.113.55 port 53194
Aug 15 09:44:30 rmg-web-02 sshd[24951]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:44:30 rmg-web-02 sshd[24951]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:44:32 rmg-web-02 sshd[24951]: Failed password for invalid user git from 203.0.113.55 port 53194 ssh2
Aug 15 09:44:33 rmg-web-02 sshd[24951]: Connection closed by invalid user git 203.0.113.55 port 53194 [preauth]
Aug 15 09:44:39 rmg-web-02 sshd[24957]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=testuser
Aug 15 09:44:41 rmg-web-02 sshd[24957]: Failed password for testuser from 203.0.113.12 port 43547 ssh2
Aug 15 09:44:43 rmg-web-02 sshd[24958]: Invalid user test from 203.0.113.55 port 57342
Aug 15 09:44:44 rmg-web-02 sshd[24958]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:44:44 rmg-web-02 sshd[24958]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:44:46 rmg-web-02 sshd[24958]: Failed password for invalid user test from 203.0.113.55 port 57342 ssh2
Aug 15 09:44:46 rmg-web-02 sshd[24960]: Invalid user admin from 203.0.113.12 port 33032
Aug 15 09:44:47 rmg-web-02 sshd[24958]: Connection closed by invalid user test 203.0.113.55 port 57342 [preauth]
Aug 15 09:44:47 rmg-web-02 sshd[24960]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:44:47 rmg-web-02 sshd[24960]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:44:49 rmg-web-02 sshd[24960]: Failed password for invalid user admin from 203.0.113.12 port 33032 ssh2
Aug 15 09:44:50 rmg-web-02 sshd[24960]: Connection closed by invalid user admin 203.0.113.12 port 33032 [preauth]
Aug 15 09:44:51 rmg-web-02 sshd[24966]: Invalid user git from 198.51.100.77 port 40565
Aug 15 09:44:52 rmg-web-02 sshd[24966]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:44:52 rmg-web-02 sshd[24966]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:44:54 rmg-web-02 sshd[24966]: Failed password for invalid user git from 198.51.100.77 port 40565 ssh2
Aug 15 09:44:55 rmg-web-02 sshd[24966]: Connection closed by invalid user git 198.51.100.77 port 40565 [preauth]
Aug 15 09:45:00 rmg-web-02 sshd[24968]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=root
Aug 15 09:45:02 rmg-web-02 sshd[24968]: Failed password for root from 203.0.113.55 port 51599 ssh2
Aug 15 09:45:04 rmg-web-02 sshd[22056]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 09:45:06 rmg-web-02 sshd[22056]: Failed password for nagios from 10.20.9.40 port 59221 ssh2
Aug 15 09:45:09 rmg-web-02 sshd[24971]: Invalid user oracle from 203.0.113.12 port 53866
Aug 15 09:45:10 rmg-web-02 sshd[24971]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:45:10 rmg-web-02 sshd[24971]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:45:12 rmg-web-02 sshd[24971]: Failed password for invalid user oracle from 203.0.113.12 port 53866 ssh2
Aug 15 09:45:13 rmg-web-02 sshd[24971]: Connection closed by invalid user oracle 203.0.113.12 port 53866 [preauth]
Aug 15 09:45:13 rmg-web-02 sshd[24979]: Invalid user deploy from 203.0.113.88 port 35478
Aug 15 09:45:14 rmg-web-02 sshd[24979]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:45:14 rmg-web-02 sshd[24979]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:45:16 rmg-web-02 sshd[24979]: Failed password for invalid user deploy from 203.0.113.88 port 35478 ssh2
Aug 15 09:45:17 rmg-web-02 sshd[24979]: Connection closed by invalid user deploy 203.0.113.88 port 35478 [preauth]
Aug 15 09:45:23 rmg-web-02 sshd[24985]: Invalid user deploy from 203.0.113.55 port 52168
Aug 15 09:45:24 rmg-web-02 sshd[24985]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:45:24 rmg-web-02 sshd[24985]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:45:26 rmg-web-02 sshd[24985]: Failed password for invalid user deploy from 203.0.113.55 port 52168 ssh2
Aug 15 09:45:26 rmg-web-02 sshd[24991]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77  user=testuser
Aug 15 09:45:27 rmg-web-02 sshd[24985]: Connection closed by invalid user deploy 203.0.113.55 port 52168 [preauth]
Aug 15 09:45:28 rmg-web-02 sshd[24991]: Failed password for testuser from 198.51.100.77 port 60344 ssh2
Aug 15 09:45:37 rmg-web-02 sshd[24998]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=postgres
Aug 15 09:45:39 rmg-web-02 sshd[24998]: Failed password for postgres from 203.0.113.12 port 46528 ssh2
Aug 15 09:45:47 rmg-web-02 sshd[25004]: Invalid user deploy from 203.0.113.55 port 48595
Aug 15 09:45:48 rmg-web-02 sshd[25004]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:45:48 rmg-web-02 sshd[25004]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:45:50 rmg-web-02 sshd[25004]: Failed password for invalid user deploy from 203.0.113.55 port 48595 ssh2
Aug 15 09:45:51 rmg-web-02 sshd[25004]: Connection closed by invalid user deploy 203.0.113.55 port 48595 [preauth]
Aug 15 09:45:51 rmg-web-02 sshd[25008]: Invalid user git from 203.0.113.12 port 63875
Aug 15 09:45:52 rmg-web-02 sshd[25008]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:45:52 rmg-web-02 sshd[25008]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:45:54 rmg-web-02 sshd[25008]: Failed password for invalid user git from 203.0.113.12 port 63875 ssh2
Aug 15 09:45:55 rmg-web-02 sshd[25008]: Connection closed by invalid user git 203.0.113.12 port 63875 [preauth]
Aug 15 09:45:59 rmg-web-02 sshd[25016]: Invalid user test from 203.0.113.12 port 57182
Aug 15 09:46:00 rmg-web-02 sshd[25016]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:46:00 rmg-web-02 sshd[25016]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:46:02 rmg-web-02 sshd[25016]: Failed password for invalid user test from 203.0.113.12 port 57182 ssh2
Aug 15 09:46:03 rmg-web-02 sshd[25016]: Connection closed by invalid user test 203.0.113.12 port 57182 [preauth]
Aug 15 09:46:05 rmg-web-02 sshd[25024]: Invalid user test from 203.0.113.55 port 59745
Aug 15 09:46:06 rmg-web-02 sshd[25024]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:46:06 rmg-web-02 sshd[25024]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:46:08 rmg-web-02 sshd[25024]: Failed password for invalid user test from 203.0.113.55 port 59745 ssh2
Aug 15 09:46:09 rmg-web-02 sshd[25024]: Connection closed by invalid user test 203.0.113.55 port 59745 [preauth]
Aug 15 09:46:16 rmg-web-02 sshd[25029]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:46:18 rmg-web-02 sshd[25029]: Failed password for postgres from 203.0.113.55 port 51843 ssh2
Aug 15 09:46:21 rmg-web-02 sshd[25036]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=testuser
Aug 15 09:46:23 rmg-web-02 sshd[25036]: Failed password for testuser from 203.0.113.88 port 61015 ssh2
Aug 15 09:46:27 rmg-web-02 sshd[25044]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=testuser
Aug 15 09:46:29 rmg-web-02 sshd[25044]: Failed password for testuser from 203.0.113.88 port 52467 ssh2
Aug 15 09:46:37 rmg-web-02 sshd[25047]: Invalid user git from 203.0.113.55 port 34726
Aug 15 09:46:38 rmg-web-02 sshd[25047]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:46:38 rmg-web-02 sshd[25047]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:46:40 rmg-web-02 sshd[25047]: Failed password for invalid user git from 203.0.113.55 port 34726 ssh2
Aug 15 09:46:41 rmg-web-02 sshd[25047]: Connection closed by invalid user git 203.0.113.55 port 34726 [preauth]
Aug 15 09:46:44 rmg-web-02 sshd[25056]: Invalid user deploy from 203.0.113.55 port 31736
Aug 15 09:46:45 rmg-web-02 sshd[25056]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:46:45 rmg-web-02 sshd[25056]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:46:47 rmg-web-02 sshd[25056]: Failed password for invalid user deploy from 203.0.113.55 port 31736 ssh2
Aug 15 09:46:48 rmg-web-02 sshd[25056]: Connection closed by invalid user deploy 203.0.113.55 port 31736 [preauth]
Aug 15 09:46:55 rmg-web-02 sshd[25061]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:46:57 rmg-web-02 sshd[25061]: Failed password for postgres from 203.0.113.55 port 59198 ssh2
Aug 15 09:47:24 rmg-web-02 sshd[23135]: Invalid user admin from 192.0.2.44 port 53442
Aug 15 09:47:25 rmg-web-02 sshd[23135]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:47:25 rmg-web-02 sshd[23135]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 09:47:27 rmg-web-02 sshd[23135]: Failed password for invalid user admin from 192.0.2.44 port 53442 ssh2
Aug 15 09:47:28 rmg-web-02 sshd[23135]: Connection closed by invalid user admin 192.0.2.44 port 53442 [preauth]
Aug 15 09:48:54 rmg-web-02 sshd[23143]: Invalid user pi from 198.51.100.202 port 51930
Aug 15 09:48:55 rmg-web-02 sshd[23143]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:48:55 rmg-web-02 sshd[23143]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 09:48:57 rmg-web-02 sshd[23143]: Failed password for invalid user pi from 198.51.100.202 port 51930 ssh2
Aug 15 09:48:58 rmg-web-02 sshd[23143]: Connection closed by invalid user pi 198.51.100.202 port 51930 [preauth]
Aug 15 09:50:14 rmg-web-02 sshd[22063]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 09:50:16 rmg-web-02 sshd[22063]: Failed password for nagios from 10.20.9.40 port 39280 ssh2
Aug 15 09:55:22 rmg-web-02 sshd[22071]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 09:55:24 rmg-web-02 sshd[22071]: Failed password for nagios from 10.20.9.40 port 57771 ssh2
Aug 15 10:00:23 rmg-web-02 sshd[22072]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 10:00:25 rmg-web-02 sshd[22072]: Failed password for nagios from 10.20.9.40 port 52330 ssh2
Aug 15 10:05:06 rmg-web-02 sshd[22075]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 10:05:08 rmg-web-02 sshd[22075]: Failed password for nagios from 10.20.9.40 port 40657 ssh2
Aug 15 10:05:12 rmg-web-02 sshd[23189]: Invalid user support from 192.0.2.44 port 48251
Aug 15 10:05:13 rmg-web-02 sshd[23189]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 10:05:13 rmg-web-02 sshd[23189]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 10:05:15 rmg-web-02 sshd[23189]: Failed password for invalid user support from 192.0.2.44 port 48251 ssh2
Aug 15 10:05:16 rmg-web-02 sshd[23189]: Connection closed by invalid user support 192.0.2.44 port 48251 [preauth]
Aug 15 10:10:08 rmg-web-02 sshd[22079]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 10:10:10 rmg-web-02 sshd[22079]: Failed password for nagios from 10.20.9.40 port 60164 ssh2
Aug 15 10:14:22 rmg-web-02 sshd[25062]: Accepted password for testuser from 203.0.113.55 port 40460 ssh2
Aug 15 10:14:23 rmg-web-02 sshd[25062]: pam_unix(sshd:session): session opened for user testuser(uid=1004) by (uid=0)
Aug 15 10:15:28 rmg-web-02 sshd[22081]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 10:15:30 rmg-web-02 sshd[22081]: Failed password for nagios from 10.20.9.40 port 35112 ssh2
Aug 15 10:17:01 rmg-web-02 CRON[18934]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 10:17:01 rmg-web-02 CRON[25025]: pam_unix(cron:session): session closed for user root
Aug 15 10:17:15 rmg-web-02 sshd[23175]: Invalid user ubuntu from 198.51.100.23 port 61007
Aug 15 10:17:16 rmg-web-02 sshd[23175]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 10:17:16 rmg-web-02 sshd[23175]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Aug 15 10:17:18 rmg-web-02 sshd[23175]: Failed password for invalid user ubuntu from 198.51.100.23 port 61007 ssh2
Aug 15 10:17:19 rmg-web-02 sshd[23175]: Connection closed by invalid user ubuntu 198.51.100.23 port 61007 [preauth]
Aug 15 10:18:32 rmg-web-02 sshd[23160]: Invalid user jenkins from 203.0.113.12 port 39392
Aug 15 10:18:33 rmg-web-02 sshd[23160]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 10:18:33 rmg-web-02 sshd[23160]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 10:18:35 rmg-web-02 sshd[23160]: Failed password for invalid user jenkins from 203.0.113.12 port 39392 ssh2
Aug 15 10:18:36 rmg-web-02 sshd[23160]: Connection closed by invalid user jenkins 203.0.113.12 port 39392 [preauth]
Aug 15 10:20:11 rmg-web-02 sshd[22085]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 10:20:13 rmg-web-02 sshd[22085]: Failed password for nagios from 10.20.9.40 port 44958 ssh2
Aug 15 10:22:41 rmg-web-02 sudo:  testuser : TTY=pts/1 ; PWD=/home/testuser ; USER=root ; COMMAND=/usr/sbin/useradd -m -s /bin/bash -u 1501 sysmon
Aug 15 10:22:41 rmg-web-02 sudo: pam_unix(sudo:session): session opened for user root(uid=0) by testuser(uid=1004)
Aug 15 10:22:42 rmg-web-02 useradd[25340]: new group: name=sysmon, GID=1501
Aug 15 10:22:42 rmg-web-02 useradd[25340]: new user: name=sysmon, UID=1501, GID=1501, home=/home/sysmon, shell=/bin/bash
Aug 15 10:22:44 rmg-web-02 sudo: pam_unix(sudo:session): session closed for user root
Aug 15 10:23:18 rmg-web-02 passwd[25361]: password for 'sysmon' changed by 'root'
Aug 15 10:25:10 rmg-web-02 sshd[22087]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 10:25:12 rmg-web-02 sshd[22087]: Failed password for nagios from 10.20.9.40 port 49580 ssh2
Aug 15 10:30:05 rmg-web-02 sshd[22096]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 10:30:07 rmg-web-02 sshd[22096]: Failed password for nagios from 10.20.9.40 port 35736 ssh2
Aug 15 10:31:05 rmg-web-02 sudo:  testuser : TTY=pts/1 ; PWD=/home/testuser ; USER=root ; COMMAND=/usr/sbin/usermod -aG sudo sysmon
Aug 15 10:31:05 rmg-web-02 sudo: pam_unix(sudo:session): session opened for user root(uid=0) by testuser(uid=1004)
Aug 15 10:31:06 rmg-web-02 usermod[25402]: add 'sysmon' to group 'sudo'
Aug 15 10:31:06 rmg-web-02 usermod[25402]: add 'sysmon' to shadow group 'sudo'
Aug 15 10:31:08 rmg-web-02 sudo: pam_unix(sudo:session): session closed for user root
Aug 15 10:35:04 rmg-web-02 sshd[22097]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 10:35:06 rmg-web-02 sshd[22097]: Failed password for nagios from 10.20.9.40 port 30304 ssh2
Aug 15 10:40:12 rmg-web-02 crontab[25455]: (sysmon) BEGIN EDIT (sysmon)
Aug 15 10:40:13 rmg-web-02 sshd[22100]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 10:40:15 rmg-web-02 sshd[22100]: Failed password for nagios from 10.20.9.40 port 47161 ssh2
Aug 15 10:40:51 rmg-web-02 crontab[25455]: (sysmon) REPLACE (sysmon)
Aug 15 10:40:51 rmg-web-02 crontab[25455]: (sysmon) END EDIT (sysmon)
Aug 15 10:42:33 rmg-web-02 sshd[23166]: Invalid user mysql from 192.0.2.171 port 46175
Aug 15 10:42:34 rmg-web-02 sshd[23166]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 10:42:34 rmg-web-02 sshd[23166]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Aug 15 10:42:36 rmg-web-02 sshd[23166]: Failed password for invalid user mysql from 192.0.2.171 port 46175 ssh2
Aug 15 10:42:37 rmg-web-02 sshd[23166]: Connection closed by invalid user mysql 192.0.2.171 port 46175 [preauth]
Aug 15 10:45:21 rmg-web-02 sshd[22108]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 10:45:23 rmg-web-02 sshd[22108]: Failed password for nagios from 10.20.9.40 port 44441 ssh2
Aug 15 10:50:10 rmg-web-02 sshd[22109]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 10:50:12 rmg-web-02 sshd[22109]: Failed password for nagios from 10.20.9.40 port 51583 ssh2
Aug 15 10:52:26 rmg-web-02 sshd[23183]: Invalid user guest from 198.51.100.202 port 40956
Aug 15 10:52:27 rmg-web-02 sshd[23183]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 10:52:27 rmg-web-02 sshd[23183]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 10:52:29 rmg-web-02 sshd[23183]: Failed password for invalid user guest from 198.51.100.202 port 40956 ssh2
Aug 15 10:52:30 rmg-web-02 sshd[23183]: Connection closed by invalid user guest 198.51.100.202 port 40956 [preauth]
Aug 15 10:52:30 rmg-web-02 sshd[25062]: pam_unix(sshd:session): session closed for user testuser
Aug 15 10:53:07 rmg-web-02 sshd[23194]: Invalid user guest from 192.0.2.44 port 53348
Aug 15 10:53:08 rmg-web-02 sshd[23194]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 10:53:08 rmg-web-02 sshd[23194]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 10:53:10 rmg-web-02 sshd[23194]: Failed password for invalid user guest from 192.0.2.44 port 53348 ssh2
Aug 15 10:53:11 rmg-web-02 sshd[23194]: Connection closed by invalid user guest 192.0.2.44 port 53348 [preauth]
Aug 15 10:55:24 rmg-web-02 sshd[22113]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 10:55:26 rmg-web-02 sshd[22113]: Failed password for nagios from 10.20.9.40 port 37806 ssh2
Aug 15 10:59:39 rmg-web-02 sshd[23151]: Invalid user pi from 192.0.2.44 port 32710
Aug 15 10:59:40 rmg-web-02 sshd[23151]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 10:59:40 rmg-web-02 sshd[23151]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 10:59:42 rmg-web-02 sshd[23151]: Failed password for invalid user pi from 192.0.2.44 port 32710 ssh2
Aug 15 10:59:43 rmg-web-02 sshd[23151]: Connection closed by invalid user pi 192.0.2.44 port 32710 [preauth]
Aug 15 11:00:07 rmg-web-02 sshd[22118]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 11:00:09 rmg-web-02 sshd[22118]: Failed password for nagios from 10.20.9.40 port 57225 ssh2
Aug 15 11:00:57 rmg-web-02 sshd[23215]: Invalid user support from 192.0.2.44 port 44901
Aug 15 11:00:58 rmg-web-02 sshd[23215]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 11:00:58 rmg-web-02 sshd[23215]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 11:01:00 rmg-web-02 sshd[23215]: Failed password for invalid user support from 192.0.2.44 port 44901 ssh2
Aug 15 11:01:01 rmg-web-02 sshd[23215]: Connection closed by invalid user support 192.0.2.44 port 44901 [preauth]
Aug 15 11:05:02 rmg-web-02 sshd[22123]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 11:05:04 rmg-web-02 sshd[22123]: Failed password for nagios from 10.20.9.40 port 52306 ssh2
Aug 15 11:05:14 rmg-web-02 sshd[25064]: Accepted publickey for sysmon from 203.0.113.55 port 56524 ssh2
Aug 15 11:05:15 rmg-web-02 sshd[25064]: pam_unix(sshd:session): session opened for user sysmon(uid=1501) by (uid=0)
Aug 15 11:06:02 rmg-web-02 sudo:  sysmon : TTY=pts/3 ; PWD=/var/www/portal ; USER=root ; COMMAND=/bin/tar -czf /tmp/.cache/pt.tar.gz /var/www/portal/exports
Aug 15 11:06:02 rmg-web-02 sudo: pam_unix(sudo:session): session opened for user root(uid=0) by sysmon(uid=1501)
Aug 15 11:06:49 rmg-web-02 sshd[23198]: Invalid user test from 198.51.100.23 port 42465
Aug 15 11:06:50 rmg-web-02 sshd[23198]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 11:06:50 rmg-web-02 sshd[23198]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Aug 15 11:06:52 rmg-web-02 sshd[23198]: Failed password for invalid user test from 198.51.100.23 port 42465 ssh2
Aug 15 11:06:53 rmg-web-02 sshd[23198]: Connection closed by invalid user test 198.51.100.23 port 42465 [preauth]
Aug 15 11:09:40 rmg-web-02 sudo: pam_unix(sudo:session): session closed for user root
Aug 15 11:10:10 rmg-web-02 sshd[22127]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 11:10:12 rmg-web-02 sshd[22127]: Failed password for nagios from 10.20.9.40 port 35500 ssh2
Aug 15 11:15:04 rmg-web-02 sshd[23200]: Invalid user ftpuser from 192.0.2.171 port 42999
Aug 15 11:15:05 rmg-web-02 sshd[23200]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 11:15:05 rmg-web-02 sshd[23200]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Aug 15 11:15:07 rmg-web-02 sshd[23200]: Failed password for invalid user ftpuser from 192.0.2.171 port 42999 ssh2
Aug 15 11:15:08 rmg-web-02 sshd[23200]: Connection closed by invalid user ftpuser 192.0.2.171 port 42999 [preauth]
Aug 15 11:15:16 rmg-web-02 sshd[22133]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 11:15:18 rmg-web-02 sshd[22133]: Failed password for nagios from 10.20.9.40 port 46969 ssh2
Aug 15 11:17:01 rmg-web-02 CRON[13730]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 11:17:01 rmg-web-02 CRON[26697]: pam_unix(cron:session): session closed for user root
Aug 15 11:17:50 rmg-web-02 sshd[23223]: Invalid user ftpuser from 198.51.100.202 port 64210
Aug 15 11:17:51 rmg-web-02 sshd[23223]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 11:17:51 rmg-web-02 sshd[23223]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 11:17:53 rmg-web-02 sshd[23223]: Failed password for invalid user ftpuser from 198.51.100.202 port 64210 ssh2
Aug 15 11:17:54 rmg-web-02 sshd[23223]: Connection closed by invalid user ftpuser 198.51.100.202 port 64210 [preauth]
Aug 15 11:20:06 rmg-web-02 sshd[22138]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 11:20:08 rmg-web-02 sshd[22138]: Failed password for nagios from 10.20.9.40 port 45213 ssh2
Aug 15 11:25:27 rmg-web-02 sshd[22146]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 11:25:29 rmg-web-02 sshd[22146]: Failed password for nagios from 10.20.9.40 port 38126 ssh2
Aug 15 11:30:23 rmg-web-02 sshd[22150]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 11:30:25 rmg-web-02 sshd[22150]: Failed password for nagios from 10.20.9.40 port 38181 ssh2
Aug 15 11:31:55 rmg-web-02 sshd[25064]: pam_unix(sshd:session): session closed for user sysmon
Aug 15 11:35:20 rmg-web-02 sshd[22153]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 11:35:22 rmg-web-02 sshd[22153]: Failed password for nagios from 10.20.9.40 port 54408 ssh2
Aug 15 11:40:17 rmg-web-02 sshd[22158]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 11:40:19 rmg-web-02 sshd[22158]: Failed password for nagios from 10.20.9.40 port 33209 ssh2
Aug 15 11:45:15 rmg-web-02 sshd[22165]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 11:45:17 rmg-web-02 sshd[22165]: Failed password for nagios from 10.20.9.40 port 62145 ssh2
Aug 15 11:46:34 rmg-web-02 sshd[23205]: Invalid user ubuntu from 203.0.113.201 port 46250
Aug 15 11:46:35 rmg-web-02 sshd[23205]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 11:46:35 rmg-web-02 sshd[23205]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Aug 15 11:46:37 rmg-web-02 sshd[23205]: Failed password for invalid user ubuntu from 203.0.113.201 port 46250 ssh2
Aug 15 11:46:38 rmg-web-02 sshd[23205]: Connection closed by invalid user ubuntu 203.0.113.201 port 46250 [preauth]
Aug 15 11:47:03 rmg-web-02 sshd[23551]: pam_unix(sshd:session): session closed for user dokafor
Aug 15 11:49:18 rmg-web-02 sshd[23211]: Invalid user mysql from 203.0.113.201 port 53946
Aug 15 11:49:19 rmg-web-02 sshd[23211]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 11:49:19 rmg-web-02 sshd[23211]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Aug 15 11:49:21 rmg-web-02 sshd[23211]: Failed password for invalid user mysql from 203.0.113.201 port 53946 ssh2
Aug 15 11:49:22 rmg-web-02 sshd[23211]: Connection closed by invalid user mysql 203.0.113.201 port 53946 [preauth]
Aug 15 11:50:19 rmg-web-02 sshd[22172]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 11:50:21 rmg-web-02 sshd[22172]: Failed password for nagios from 10.20.9.40 port 63458 ssh2
Aug 15 11:55:10 rmg-web-02 sshd[22177]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 11:55:12 rmg-web-02 sshd[22177]: Failed password for nagios from 10.20.9.40 port 56115 ssh2
Aug 15 12:00:22 rmg-web-02 sshd[22186]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 12:00:24 rmg-web-02 sshd[22186]: Failed password for nagios from 10.20.9.40 port 49857 ssh2
Aug 15 12:03:04 rmg-web-02 sshd[23238]: Invalid user git from 203.0.113.12 port 34592
Aug 15 12:03:05 rmg-web-02 sshd[23238]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 12:03:05 rmg-web-02 sshd[23238]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 12:03:07 rmg-web-02 sshd[23238]: Failed password for invalid user git from 203.0.113.12 port 34592 ssh2
Aug 15 12:03:08 rmg-web-02 sshd[23238]: Connection closed by invalid user git 203.0.113.12 port 34592 [preauth]
Aug 15 12:05:18 rmg-web-02 sshd[22194]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 12:05:19 rmg-web-02 sshd[23236]: Invalid user git from 198.51.100.202 port 48501
Aug 15 12:05:20 rmg-web-02 sshd[22194]: Failed password for nagios from 10.20.9.40 port 49365 ssh2
Aug 15 12:05:20 rmg-web-02 sshd[23236]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 12:05:20 rmg-web-02 sshd[23236]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 12:05:22 rmg-web-02 sshd[23236]: Failed password for invalid user git from 198.51.100.202 port 48501 ssh2
Aug 15 12:05:23 rmg-web-02 sshd[23236]: Connection closed by invalid user git 198.51.100.202 port 48501 [preauth]
Aug 15 12:10:00 rmg-web-02 sshd[22197]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 12:10:02 rmg-web-02 sshd[22197]: Failed password for nagios from 10.20.9.40 port 40744 ssh2
Aug 15 12:15:19 rmg-web-02 sshd[22200]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 12:15:21 rmg-web-02 sshd[22200]: Failed password for nagios from 10.20.9.40 port 43984 ssh2
Aug 15 12:17:01 rmg-web-02 CRON[21820]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 12:17:01 rmg-web-02 CRON[20489]: pam_unix(cron:session): session closed for user root
Aug 15 12:20:18 rmg-web-02 sshd[22205]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 12:20:20 rmg-web-02 sshd[22205]: Failed password for nagios from 10.20.9.40 port 30800 ssh2
Aug 15 12:25:20 rmg-web-02 sshd[22211]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 12:25:22 rmg-web-02 sshd[22211]: Failed password for nagios from 10.20.9.40 port 61236 ssh2
Aug 15 12:30:20 rmg-web-02 sshd[22220]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 12:30:22 rmg-web-02 sshd[22220]: Failed password for nagios from 10.20.9.40 port 45513 ssh2
Aug 15 12:35:01 rmg-web-02 sshd[22229]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 12:35:03 rmg-web-02 sshd[22229]: Failed password for nagios from 10.20.9.40 port 35055 ssh2
Aug 15 12:40:08 rmg-web-02 sshd[22231]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 12:40:10 rmg-web-02 sshd[22231]: Failed password for nagios from 10.20.9.40 port 45137 ssh2
Aug 15 12:43:01 rmg-web-02 sshd[23227]: Invalid user pi from 203.0.113.201 port 54513
Aug 15 12:43:02 rmg-web-02 sshd[23227]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 12:43:02 rmg-web-02 sshd[23227]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Aug 15 12:43:04 rmg-web-02 sshd[23227]: Failed password for invalid user pi from 203.0.113.201 port 54513 ssh2
Aug 15 12:43:05 rmg-web-02 sshd[23227]: Connection closed by invalid user pi 203.0.113.201 port 54513 [preauth]
Aug 15 12:45:03 rmg-web-02 sshd[22238]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 12:45:05 rmg-web-02 sshd[22238]: Failed password for nagios from 10.20.9.40 port 31770 ssh2
Aug 15 12:50:03 rmg-web-02 sshd[22245]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 12:50:05 rmg-web-02 sshd[22245]: Failed password for nagios from 10.20.9.40 port 42343 ssh2
Aug 15 12:55:21 rmg-web-02 sshd[22248]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 12:55:23 rmg-web-02 sshd[22248]: Failed password for nagios from 10.20.9.40 port 33988 ssh2
Aug 15 13:00:26 rmg-web-02 sshd[22255]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 13:00:28 rmg-web-02 sshd[22255]: Failed password for nagios from 10.20.9.40 port 49335 ssh2
Aug 15 13:05:27 rmg-web-02 sshd[22261]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 13:05:29 rmg-web-02 sshd[22261]: Failed password for nagios from 10.20.9.40 port 40890 ssh2
Aug 15 13:10:00 rmg-web-02 sshd[22264]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 13:10:02 rmg-web-02 sshd[22264]: Failed password for nagios from 10.20.9.40 port 49656 ssh2
Aug 15 13:12:44 rmg-web-02 sshd[23254]: Invalid user ubuntu from 198.51.100.202 port 59311
Aug 15 13:12:45 rmg-web-02 sshd[23254]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 13:12:45 rmg-web-02 sshd[23254]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 13:12:47 rmg-web-02 sshd[23254]: Failed password for invalid user ubuntu from 198.51.100.202 port 59311 ssh2
Aug 15 13:12:48 rmg-web-02 sshd[23254]: Connection closed by invalid user ubuntu 198.51.100.202 port 59311 [preauth]
Aug 15 13:15:11 rmg-web-02 sshd[22269]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 13:15:13 rmg-web-02 sshd[22269]: Failed password for nagios from 10.20.9.40 port 48421 ssh2
Aug 15 13:17:01 rmg-web-02 CRON[26471]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 13:17:01 rmg-web-02 CRON[18160]: pam_unix(cron:session): session closed for user root
Aug 15 13:20:19 rmg-web-02 sshd[22274]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 13:20:21 rmg-web-02 sshd[22274]: Failed password for nagios from 10.20.9.40 port 58592 ssh2
Aug 15 13:25:04 rmg-web-02 sshd[22283]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 13:25:06 rmg-web-02 sshd[22283]: Failed password for nagios from 10.20.9.40 port 42080 ssh2
Aug 15 13:30:08 rmg-web-02 sshd[22292]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 13:30:10 rmg-web-02 sshd[22292]: Failed password for nagios from 10.20.9.40 port 51422 ssh2
Aug 15 13:35:24 rmg-web-02 sshd[22294]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 13:35:26 rmg-web-02 sshd[22294]: Failed password for nagios from 10.20.9.40 port 33008 ssh2
Aug 15 13:40:11 rmg-web-02 sshd[22299]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 13:40:13 rmg-web-02 sshd[22299]: Failed password for nagios from 10.20.9.40 port 52925 ssh2
Aug 15 13:45:04 rmg-web-02 sshd[22300]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 13:45:06 rmg-web-02 sshd[22300]: Failed password for nagios from 10.20.9.40 port 39863 ssh2
Aug 15 13:47:44 rmg-web-02 sshd[23261]: Invalid user jenkins from 203.0.113.140 port 39050
Aug 15 13:47:45 rmg-web-02 sshd[23261]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 13:47:45 rmg-web-02 sshd[23261]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Aug 15 13:47:47 rmg-web-02 sshd[23261]: Failed password for invalid user jenkins from 203.0.113.140 port 39050 ssh2
Aug 15 13:47:48 rmg-web-02 sshd[23261]: Connection closed by invalid user jenkins 203.0.113.140 port 39050 [preauth]
Aug 15 13:48:10 rmg-web-02 sshd[23250]: Invalid user oracle from 198.51.100.202 port 44095
Aug 15 13:48:11 rmg-web-02 sshd[23250]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 13:48:11 rmg-web-02 sshd[23250]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 13:48:13 rmg-web-02 sshd[23250]: Failed password for invalid user oracle from 198.51.100.202 port 44095 ssh2
Aug 15 13:48:14 rmg-web-02 sshd[23250]: Connection closed by invalid user oracle 198.51.100.202 port 44095 [preauth]
Aug 15 13:50:30 rmg-web-02 sshd[22301]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 13:50:32 rmg-web-02 sshd[22301]: Failed password for nagios from 10.20.9.40 port 30594 ssh2
Aug 15 13:55:01 rmg-web-02 sshd[22308]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 13:55:03 rmg-web-02 sshd[22308]: Failed password for nagios from 10.20.9.40 port 64331 ssh2
Aug 15 13:59:24 rmg-web-02 sshd[23243]: Invalid user deploy from 203.0.113.140 port 63738
Aug 15 13:59:25 rmg-web-02 sshd[23243]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 13:59:25 rmg-web-02 sshd[23243]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Aug 15 13:59:27 rmg-web-02 sshd[23243]: Failed password for invalid user deploy from 203.0.113.140 port 63738 ssh2
Aug 15 13:59:28 rmg-web-02 sshd[23243]: Connection closed by invalid user deploy 203.0.113.140 port 63738 [preauth]
Aug 15 14:00:09 rmg-web-02 sshd[22314]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 14:00:11 rmg-web-02 sshd[22314]: Failed password for nagios from 10.20.9.40 port 58856 ssh2
Aug 15 14:05:11 rmg-web-02 sshd[22317]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 14:05:13 rmg-web-02 sshd[22317]: Failed password for nagios from 10.20.9.40 port 49021 ssh2
Aug 15 14:07:41 rmg-web-02 sshd[23267]: Invalid user postgres from 192.0.2.44 port 51222
Aug 15 14:07:42 rmg-web-02 sshd[23267]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 14:07:42 rmg-web-02 sshd[23267]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 14:07:44 rmg-web-02 sshd[23267]: Failed password for invalid user postgres from 192.0.2.44 port 51222 ssh2
Aug 15 14:07:45 rmg-web-02 sshd[23267]: Connection closed by invalid user postgres 192.0.2.44 port 51222 [preauth]
Aug 15 14:10:02 rmg-web-02 sshd[22320]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 14:10:04 rmg-web-02 sshd[22320]: Failed password for nagios from 10.20.9.40 port 44262 ssh2
Aug 15 14:10:32 rmg-web-02 sshd[23291]: Invalid user jenkins from 203.0.113.201 port 54702
Aug 15 14:10:33 rmg-web-02 sshd[23291]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 14:10:33 rmg-web-02 sshd[23291]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Aug 15 14:10:35 rmg-web-02 sshd[23291]: Failed password for invalid user jenkins from 203.0.113.201 port 54702 ssh2
Aug 15 14:10:36 rmg-web-02 sshd[23291]: Connection closed by invalid user jenkins 203.0.113.201 port 54702 [preauth]
Aug 15 14:15:05 rmg-web-02 sshd[22328]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 14:15:07 rmg-web-02 sshd[22328]: Failed password for nagios from 10.20.9.40 port 61211 ssh2
Aug 15 14:17:01 rmg-web-02 CRON[10120]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 14:17:01 rmg-web-02 CRON[27651]: pam_unix(cron:session): session closed for user root
Aug 15 14:17:35 rmg-web-02 sshd[23274]: Invalid user guest from 198.51.100.23 port 59920
Aug 15 14:17:36 rmg-web-02 sshd[23274]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 14:17:36 rmg-web-02 sshd[23274]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Aug 15 14:17:38 rmg-web-02 sshd[23274]: Failed password for invalid user guest from 198.51.100.23 port 59920 ssh2
Aug 15 14:17:39 rmg-web-02 sshd[23274]: Connection closed by invalid user guest 198.51.100.23 port 59920 [preauth]
Aug 15 14:19:11 rmg-web-02 sshd[23270]: Invalid user git from 192.0.2.44 port 54781
Aug 15 14:19:12 rmg-web-02 sshd[23270]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 14:19:12 rmg-web-02 sshd[23270]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 14:19:14 rmg-web-02 sshd[23270]: Failed password for invalid user git from 192.0.2.44 port 54781 ssh2
Aug 15 14:19:15 rmg-web-02 sshd[23270]: Connection closed by invalid user git 192.0.2.44 port 54781 [preauth]
Aug 15 14:20:02 rmg-web-02 sshd[22332]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 14:20:04 rmg-web-02 sshd[22332]: Failed password for nagios from 10.20.9.40 port 45143 ssh2
Aug 15 14:25:15 rmg-web-02 sshd[22339]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 14:25:17 rmg-web-02 sshd[22339]: Failed password for nagios from 10.20.9.40 port 35971 ssh2
Aug 15 14:30:13 rmg-web-02 sshd[22345]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 14:30:15 rmg-web-02 sshd[22345]: Failed password for nagios from 10.20.9.40 port 45348 ssh2
Aug 15 14:35:14 rmg-web-02 sshd[22348]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 14:35:16 rmg-web-02 sshd[22348]: Failed password for nagios from 10.20.9.40 port 62392 ssh2
Aug 15 14:40:21 rmg-web-02 sshd[22351]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 14:40:23 rmg-web-02 sshd[22351]: Failed password for nagios from 10.20.9.40 port 45254 ssh2
Aug 15 14:41:06 rmg-web-02 sshd[23279]: Invalid user user from 203.0.113.201 port 59847
Aug 15 14:41:07 rmg-web-02 sshd[23279]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 14:41:07 rmg-web-02 sshd[23279]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Aug 15 14:41:09 rmg-web-02 sshd[23279]: Failed password for invalid user user from 203.0.113.201 port 59847 ssh2
Aug 15 14:41:10 rmg-web-02 sshd[23279]: Connection closed by invalid user user 203.0.113.201 port 59847 [preauth]
Aug 15 14:43:23 rmg-web-02 sshd[23282]: Invalid user ubuntu from 198.51.100.23 port 42457
Aug 15 14:43:24 rmg-web-02 sshd[23282]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 14:43:24 rmg-web-02 sshd[23282]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Aug 15 14:43:26 rmg-web-02 sshd[23282]: Failed password for invalid user ubuntu from 198.51.100.23 port 42457 ssh2
Aug 15 14:43:27 rmg-web-02 sshd[23282]: Connection closed by invalid user ubuntu 198.51.100.23 port 42457 [preauth]
Aug 15 14:45:13 rmg-web-02 sshd[22354]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 14:45:15 rmg-web-02 sshd[22354]: Failed password for nagios from 10.20.9.40 port 33272 ssh2
Aug 15 14:47:42 rmg-web-02 sshd[23295]: Invalid user git from 198.51.100.202 port 54268
Aug 15 14:47:43 rmg-web-02 sshd[23295]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 14:47:43 rmg-web-02 sshd[23295]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 14:47:45 rmg-web-02 sshd[23295]: Failed password for invalid user git from 198.51.100.202 port 54268 ssh2
Aug 15 14:47:46 rmg-web-02 sshd[23295]: Connection closed by invalid user git 198.51.100.202 port 54268 [preauth]
Aug 15 14:50:28 rmg-web-02 sshd[22356]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 14:50:30 rmg-web-02 sshd[22356]: Failed password for nagios from 10.20.9.40 port 52917 ssh2
Aug 15 14:55:09 rmg-web-02 sshd[22365]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 14:55:11 rmg-web-02 sshd[22365]: Failed password for nagios from 10.20.9.40 port 30835 ssh2
Aug 15 15:00:21 rmg-web-02 sshd[23316]: Invalid user support from 203.0.113.12 port 49771
Aug 15 15:00:22 rmg-web-02 sshd[23316]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 15:00:22 rmg-web-02 sshd[23316]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 15:00:24 rmg-web-02 sshd[22372]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 15:00:24 rmg-web-02 sshd[23316]: Failed password for invalid user support from 203.0.113.12 port 49771 ssh2
Aug 15 15:00:25 rmg-web-02 sshd[23316]: Connection closed by invalid user support 203.0.113.12 port 49771 [preauth]
Aug 15 15:00:26 rmg-web-02 sshd[22372]: Failed password for nagios from 10.20.9.40 port 52692 ssh2
Aug 15 15:05:24 rmg-web-02 sshd[22377]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 15:05:26 rmg-web-02 sshd[22377]: Failed password for nagios from 10.20.9.40 port 34153 ssh2
Aug 15 15:08:54 rmg-web-02 sshd[23317]: Invalid user jenkins from 198.51.100.202 port 50356
Aug 15 15:08:55 rmg-web-02 sshd[23317]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 15:08:55 rmg-web-02 sshd[23317]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 15:08:57 rmg-web-02 sshd[23317]: Failed password for invalid user jenkins from 198.51.100.202 port 50356 ssh2
Aug 15 15:08:58 rmg-web-02 sshd[23317]: Connection closed by invalid user jenkins 198.51.100.202 port 50356 [preauth]
Aug 15 15:10:25 rmg-web-02 sshd[22379]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 15:10:27 rmg-web-02 sshd[22379]: Failed password for nagios from 10.20.9.40 port 57436 ssh2
Aug 15 15:15:20 rmg-web-02 sshd[22380]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 15:15:22 rmg-web-02 sshd[22380]: Failed password for nagios from 10.20.9.40 port 47708 ssh2
Aug 15 15:17:01 rmg-web-02 CRON[14286]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 15:17:01 rmg-web-02 CRON[28384]: pam_unix(cron:session): session closed for user root
Aug 15 15:20:07 rmg-web-02 sshd[22387]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 15:20:09 rmg-web-02 sshd[22387]: Failed password for nagios from 10.20.9.40 port 57747 ssh2
Aug 15 15:20:22 rmg-web-02 sshd[23325]: Invalid user support from 192.0.2.171 port 40396
Aug 15 15:20:23 rmg-web-02 sshd[23325]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 15:20:23 rmg-web-02 sshd[23325]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Aug 15 15:20:25 rmg-web-02 sshd[23325]: Failed password for invalid user support from 192.0.2.171 port 40396 ssh2
Aug 15 15:20:26 rmg-web-02 sshd[23325]: Connection closed by invalid user support 192.0.2.171 port 40396 [preauth]
Aug 15 15:25:02 rmg-web-02 sshd[22390]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 15:25:04 rmg-web-02 sshd[22390]: Failed password for nagios from 10.20.9.40 port 30043 ssh2
Aug 15 15:26:19 rmg-web-02 sshd[23302]: Invalid user webmaster from 203.0.113.140 port 53683
Aug 15 15:26:20 rmg-web-02 sshd[23302]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 15:26:20 rmg-web-02 sshd[23302]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Aug 15 15:26:22 rmg-web-02 sshd[23302]: Failed password for invalid user webmaster from 203.0.113.140 port 53683 ssh2
Aug 15 15:26:23 rmg-web-02 sshd[23302]: Connection closed by invalid user webmaster 203.0.113.140 port 53683 [preauth]
Aug 15 15:30:19 rmg-web-02 sshd[22398]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 15:30:21 rmg-web-02 sshd[22398]: Failed password for nagios from 10.20.9.40 port 45444 ssh2
Aug 15 15:35:23 rmg-web-02 sshd[22400]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 15:35:25 rmg-web-02 sshd[22400]: Failed password for nagios from 10.20.9.40 port 35971 ssh2
Aug 15 15:39:19 rmg-web-02 sshd[23310]: Invalid user mysql from 203.0.113.12 port 47574
Aug 15 15:39:20 rmg-web-02 sshd[23310]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 15:39:20 rmg-web-02 sshd[23310]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 15:39:22 rmg-web-02 sshd[23310]: Failed password for invalid user mysql from 203.0.113.12 port 47574 ssh2
Aug 15 15:39:23 rmg-web-02 sshd[23310]: Connection closed by invalid user mysql 203.0.113.12 port 47574 [preauth]
Aug 15 15:40:17 rmg-web-02 sshd[22403]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 15:40:19 rmg-web-02 sshd[22403]: Failed password for nagios from 10.20.9.40 port 50792 ssh2
Aug 15 15:41:24 rmg-web-02 sshd[23299]: Invalid user webmaster from 192.0.2.9 port 49194
Aug 15 15:41:25 rmg-web-02 sshd[23299]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 15:41:25 rmg-web-02 sshd[23299]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.9
Aug 15 15:41:27 rmg-web-02 sshd[23299]: Failed password for invalid user webmaster from 192.0.2.9 port 49194 ssh2
Aug 15 15:41:28 rmg-web-02 sshd[23299]: Connection closed by invalid user webmaster 192.0.2.9 port 49194 [preauth]
Aug 15 15:45:22 rmg-web-02 sshd[22407]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 15:45:24 rmg-web-02 sshd[22407]: Failed password for nagios from 10.20.9.40 port 40767 ssh2
Aug 15 15:50:21 rmg-web-02 sshd[22414]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 15:50:23 rmg-web-02 sshd[22414]: Failed password for nagios from 10.20.9.40 port 45536 ssh2
Aug 15 15:55:07 rmg-web-02 sshd[22422]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 15:55:09 rmg-web-02 sshd[22422]: Failed password for nagios from 10.20.9.40 port 48862 ssh2
Aug 15 16:00:04 rmg-web-02 sshd[22430]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 16:00:06 rmg-web-02 sshd[22430]: Failed password for nagios from 10.20.9.40 port 56392 ssh2
Aug 15 16:05:23 rmg-web-02 sshd[22438]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 16:05:25 rmg-web-02 sshd[22438]: Failed password for nagios from 10.20.9.40 port 55409 ssh2
Aug 15 16:10:06 rmg-web-02 sshd[22440]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 16:10:08 rmg-web-02 sshd[22440]: Failed password for nagios from 10.20.9.40 port 47877 ssh2
Aug 15 16:11:59 rmg-web-02 sshd[23343]: Invalid user deploy from 192.0.2.44 port 46197
Aug 15 16:12:00 rmg-web-02 sshd[23343]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 16:12:00 rmg-web-02 sshd[23343]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 16:12:02 rmg-web-02 sshd[23343]: Failed password for invalid user deploy from 192.0.2.44 port 46197 ssh2
Aug 15 16:12:03 rmg-web-02 sshd[23343]: Connection closed by invalid user deploy 192.0.2.44 port 46197 [preauth]
Aug 15 16:15:02 rmg-web-02 sshd[22449]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 16:15:04 rmg-web-02 sshd[22449]: Failed password for nagios from 10.20.9.40 port 41548 ssh2
Aug 15 16:17:01 rmg-web-02 CRON[21359]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 16:17:01 rmg-web-02 CRON[13637]: pam_unix(cron:session): session closed for user root
Aug 15 16:20:17 rmg-web-02 sshd[22455]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 16:20:19 rmg-web-02 sshd[22455]: Failed password for nagios from 10.20.9.40 port 49388 ssh2
Aug 15 16:25:10 rmg-web-02 sshd[22462]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 16:25:12 rmg-web-02 sshd[22462]: Failed password for nagios from 10.20.9.40 port 40070 ssh2
Aug 15 16:30:13 rmg-web-02 sshd[22469]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 16:30:15 rmg-web-02 sshd[22469]: Failed password for nagios from 10.20.9.40 port 52580 ssh2
Aug 15 16:32:59 rmg-web-02 sshd[23337]: Invalid user guest from 198.51.100.23 port 46164
Aug 15 16:33:00 rmg-web-02 sshd[23337]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 16:33:00 rmg-web-02 sshd[23337]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Aug 15 16:33:02 rmg-web-02 sshd[23337]: Failed password for invalid user guest from 198.51.100.23 port 46164 ssh2
Aug 15 16:33:03 rmg-web-02 sshd[23337]: Connection closed by invalid user guest 198.51.100.23 port 46164 [preauth]
Aug 15 16:35:02 rmg-web-02 sshd[22476]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 16:35:04 rmg-web-02 sshd[22476]: Failed password for nagios from 10.20.9.40 port 54884 ssh2
Aug 15 16:38:26 rmg-web-02 sshd[23352]: Invalid user user from 198.51.100.202 port 55544
Aug 15 16:38:27 rmg-web-02 sshd[23352]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 16:38:27 rmg-web-02 sshd[23352]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 16:38:29 rmg-web-02 sshd[23352]: Failed password for invalid user user from 198.51.100.202 port 55544 ssh2
Aug 15 16:38:30 rmg-web-02 sshd[23352]: Connection closed by invalid user user 198.51.100.202 port 55544 [preauth]
Aug 15 16:40:11 rmg-web-02 sshd[22480]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 16:40:13 rmg-web-02 sshd[22480]: Failed password for nagios from 10.20.9.40 port 49105 ssh2
Aug 15 16:40:25 rmg-web-02 sshd[23531]: pam_unix(sshd:session): session closed for user jmartel
Aug 15 16:40:46 rmg-web-02 sshd[23328]: Invalid user test from 198.51.100.202 port 44779
Aug 15 16:40:47 rmg-web-02 sshd[23328]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 16:40:47 rmg-web-02 sshd[23328]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 16:40:49 rmg-web-02 sshd[23328]: Failed password for invalid user test from 198.51.100.202 port 44779 ssh2
Aug 15 16:40:50 rmg-web-02 sshd[23328]: Connection closed by invalid user test 198.51.100.202 port 44779 [preauth]
Aug 15 16:45:05 rmg-web-02 sshd[22487]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 16:45:07 rmg-web-02 sshd[22487]: Failed password for nagios from 10.20.9.40 port 61274 ssh2
Aug 15 16:46:17 rmg-web-02 sshd[23333]: Invalid user deploy from 203.0.113.201 port 40805
Aug 15 16:46:18 rmg-web-02 sshd[23333]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 16:46:18 rmg-web-02 sshd[23333]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Aug 15 16:46:20 rmg-web-02 sshd[23333]: Failed password for invalid user deploy from 203.0.113.201 port 40805 ssh2
Aug 15 16:46:21 rmg-web-02 sshd[23333]: Connection closed by invalid user deploy 203.0.113.201 port 40805 [preauth]
Aug 15 16:47:06 rmg-web-02 sshd[23537]: pam_unix(sshd:session): session closed for user dokafor
Aug 15 16:50:21 rmg-web-02 sshd[22489]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 16:50:23 rmg-web-02 sshd[22489]: Failed password for nagios from 10.20.9.40 port 37895 ssh2
Aug 15 16:54:55 rmg-web-02 sshd[23545]: pam_unix(sshd:session): session closed for user rchen
Aug 15 16:55:24 rmg-web-02 sshd[22494]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 16:55:26 rmg-web-02 sshd[22494]: Failed password for nagios from 10.20.9.40 port 36340 ssh2
Aug 15 17:00:25 rmg-web-02 sshd[22500]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 17:00:27 rmg-web-02 sshd[22500]: Failed password for nagios from 10.20.9.40 port 54409 ssh2
Aug 15 17:05:13 rmg-web-02 sshd[22501]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 17:05:15 rmg-web-02 sshd[22501]: Failed password for nagios from 10.20.9.40 port 43236 ssh2
Aug 15 17:06:04 rmg-web-02 sshd[23361]: Invalid user test from 203.0.113.140 port 64204
Aug 15 17:06:05 rmg-web-02 sshd[23361]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 17:06:05 rmg-web-02 sshd[23361]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Aug 15 17:06:07 rmg-web-02 sshd[23361]: Failed password for invalid user test from 203.0.113.140 port 64204 ssh2
Aug 15 17:06:08 rmg-web-02 sshd[23361]: Connection closed by invalid user test 203.0.113.140 port 64204 [preauth]
Aug 15 17:10:20 rmg-web-02 sshd[22503]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 17:10:22 rmg-web-02 sshd[22503]: Failed password for nagios from 10.20.9.40 port 63914 ssh2
Aug 15 17:15:10 rmg-web-02 sshd[22506]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 17:15:12 rmg-web-02 sshd[22506]: Failed password for nagios from 10.20.9.40 port 62005 ssh2
Aug 15 17:17:01 rmg-web-02 CRON[25352]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 17:17:01 rmg-web-02 CRON[16762]: pam_unix(cron:session): session closed for user root
Aug 15 17:18:50 rmg-web-02 sshd[23376]: Invalid user deploy from 198.51.100.202 port 37139
Aug 15 17:18:51 rmg-web-02 sshd[23376]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 17:18:51 rmg-web-02 sshd[23376]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 17:18:53 rmg-web-02 sshd[23376]: Failed password for invalid user deploy from 198.51.100.202 port 37139 ssh2
Aug 15 17:18:54 rmg-web-02 sshd[23376]: Connection closed by invalid user deploy 198.51.100.202 port 37139 [preauth]
Aug 15 17:20:22 rmg-web-02 sshd[22507]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 17:20:24 rmg-web-02 sshd[22507]: Failed password for nagios from 10.20.9.40 port 64329 ssh2
Aug 15 17:25:28 rmg-web-02 sshd[22508]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 17:25:30 rmg-web-02 sshd[22508]: Failed password for nagios from 10.20.9.40 port 39656 ssh2
Aug 15 17:26:08 rmg-web-02 sshd[23379]: Invalid user guest from 192.0.2.171 port 42572
Aug 15 17:26:09 rmg-web-02 sshd[23379]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 17:26:09 rmg-web-02 sshd[23379]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Aug 15 17:26:11 rmg-web-02 sshd[23379]: Failed password for invalid user guest from 192.0.2.171 port 42572 ssh2
Aug 15 17:26:12 rmg-web-02 sshd[23379]: Connection closed by invalid user guest 192.0.2.171 port 42572 [preauth]
Aug 15 17:30:15 rmg-web-02 sshd[22513]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 17:30:17 rmg-web-02 sshd[22513]: Failed password for nagios from 10.20.9.40 port 57267 ssh2
Aug 15 17:35:23 rmg-web-02 sshd[22520]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 17:35:25 rmg-web-02 sshd[22520]: Failed password for nagios from 10.20.9.40 port 50626 ssh2
Aug 15 17:36:51 rmg-web-02 sshd[23374]: Invalid user admin from 198.51.100.202 port 50720
Aug 15 17:36:52 rmg-web-02 sshd[23374]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 17:36:52 rmg-web-02 sshd[23374]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 17:36:54 rmg-web-02 sshd[23374]: Failed password for invalid user admin from 198.51.100.202 port 50720 ssh2
Aug 15 17:36:55 rmg-web-02 sshd[23374]: Connection closed by invalid user admin 198.51.100.202 port 50720 [preauth]
Aug 15 17:37:35 rmg-web-02 sshd[23375]: Invalid user admin from 198.51.100.202 port 59077
Aug 15 17:37:36 rmg-web-02 sshd[23375]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 17:37:36 rmg-web-02 sshd[23375]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 17:37:38 rmg-web-02 sshd[23375]: Failed password for invalid user admin from 198.51.100.202 port 59077 ssh2
Aug 15 17:37:39 rmg-web-02 sshd[23375]: Connection closed by invalid user admin 198.51.100.202 port 59077 [preauth]
Aug 15 17:38:40 rmg-web-02 sshd[23366]: Invalid user user from 192.0.2.9 port 59012
Aug 15 17:38:41 rmg-web-02 sshd[23366]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 17:38:41 rmg-web-02 sshd[23366]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.9
Aug 15 17:38:43 rmg-web-02 sshd[23366]: Failed password for invalid user user from 192.0.2.9 port 59012 ssh2
Aug 15 17:38:44 rmg-web-02 sshd[23366]: Connection closed by invalid user user 192.0.2.9 port 59012 [preauth]
Aug 15 17:40:23 rmg-web-02 sshd[22528]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 17:40:25 rmg-web-02 sshd[22528]: Failed password for nagios from 10.20.9.40 port 46304 ssh2
Aug 15 17:45:10 rmg-web-02 sshd[22531]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 17:45:12 rmg-web-02 sshd[22531]: Failed password for nagios from 10.20.9.40 port 37954 ssh2
Aug 15 17:50:17 rmg-web-02 sshd[22540]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 17:50:19 rmg-web-02 sshd[22540]: Failed password for nagios from 10.20.9.40 port 61319 ssh2
Aug 15 17:55:26 rmg-web-02 sshd[22543]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 17:55:28 rmg-web-02 sshd[22543]: Failed password for nagios from 10.20.9.40 port 55888 ssh2
Aug 15 18:00:29 rmg-web-02 sshd[22544]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 18:00:31 rmg-web-02 sshd[22544]: Failed password for nagios from 10.20.9.40 port 45464 ssh2
Aug 15 18:05:15 rmg-web-02 sshd[22551]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 18:05:17 rmg-web-02 sshd[22551]: Failed password for nagios from 10.20.9.40 port 59051 ssh2
Aug 15 18:08:36 rmg-web-02 sshd[23395]: Invalid user oracle from 198.51.100.202 port 30360
Aug 15 18:08:37 rmg-web-02 sshd[23395]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 18:08:37 rmg-web-02 sshd[23395]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 18:08:39 rmg-web-02 sshd[23395]: Failed password for invalid user oracle from 198.51.100.202 port 30360 ssh2
Aug 15 18:08:40 rmg-web-02 sshd[23395]: Connection closed by invalid user oracle 198.51.100.202 port 30360 [preauth]
Aug 15 18:10:15 rmg-web-02 sshd[22560]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 18:10:17 rmg-web-02 sshd[22560]: Failed password for nagios from 10.20.9.40 port 64235 ssh2
Aug 15 18:15:16 rmg-web-02 sshd[22567]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 18:15:18 rmg-web-02 sshd[22567]: Failed password for nagios from 10.20.9.40 port 37470 ssh2
Aug 15 18:17:01 rmg-web-02 CRON[22826]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 18:17:01 rmg-web-02 CRON[9290]: pam_unix(cron:session): session closed for user root
Aug 15 18:20:20 rmg-web-02 sshd[22568]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 18:20:22 rmg-web-02 sshd[22568]: Failed password for nagios from 10.20.9.40 port 57425 ssh2
Aug 15 18:24:17 rmg-web-02 sshd[23411]: Invalid user ubuntu from 203.0.113.12 port 62490
Aug 15 18:24:18 rmg-web-02 sshd[23411]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 18:24:18 rmg-web-02 sshd[23411]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 18:24:20 rmg-web-02 sshd[23411]: Failed password for invalid user ubuntu from 203.0.113.12 port 62490 ssh2
Aug 15 18:24:21 rmg-web-02 sshd[23411]: Connection closed by invalid user ubuntu 203.0.113.12 port 62490 [preauth]
Aug 15 18:25:05 rmg-web-02 sshd[22572]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 18:25:07 rmg-web-02 sshd[22572]: Failed password for nagios from 10.20.9.40 port 30609 ssh2
Aug 15 18:26:53 rmg-web-02 sshd[23404]: Invalid user postgres from 203.0.113.12 port 63096
Aug 15 18:26:54 rmg-web-02 sshd[23404]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 18:26:54 rmg-web-02 sshd[23404]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 18:26:56 rmg-web-02 sshd[23404]: Failed password for invalid user postgres from 203.0.113.12 port 63096 ssh2
Aug 15 18:26:57 rmg-web-02 sshd[23404]: Connection closed by invalid user postgres 203.0.113.12 port 63096 [preauth]
Aug 15 18:30:14 rmg-web-02 sshd[22573]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 18:30:16 rmg-web-02 sshd[22573]: Failed password for nagios from 10.20.9.40 port 34390 ssh2
Aug 15 18:35:28 rmg-web-02 sshd[22582]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 18:35:30 rmg-web-02 sshd[22582]: Failed password for nagios from 10.20.9.40 port 31641 ssh2
Aug 15 18:38:16 rmg-web-02 sshd[23387]: Invalid user postgres from 192.0.2.9 port 46571
Aug 15 18:38:17 rmg-web-02 sshd[23387]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 18:38:17 rmg-web-02 sshd[23387]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.9
Aug 15 18:38:19 rmg-web-02 sshd[23387]: Failed password for invalid user postgres from 192.0.2.9 port 46571 ssh2
Aug 15 18:38:20 rmg-web-02 sshd[23387]: Connection closed by invalid user postgres 192.0.2.9 port 46571 [preauth]
Aug 15 18:40:05 rmg-web-02 sshd[22583]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 18:40:07 rmg-web-02 sshd[22583]: Failed password for nagios from 10.20.9.40 port 57976 ssh2
Aug 15 18:45:30 rmg-web-02 sshd[22587]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 18:45:32 rmg-web-02 sshd[22587]: Failed password for nagios from 10.20.9.40 port 35038 ssh2
Aug 15 18:50:13 rmg-web-02 sshd[22589]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 18:50:15 rmg-web-02 sshd[22589]: Failed password for nagios from 10.20.9.40 port 37815 ssh2
Aug 15 18:55:21 rmg-web-02 sshd[22594]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 18:55:23 rmg-web-02 sshd[22594]: Failed password for nagios from 10.20.9.40 port 34237 ssh2
Aug 15 19:00:09 rmg-web-02 sshd[22598]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 19:00:11 rmg-web-02 sshd[22598]: Failed password for nagios from 10.20.9.40 port 33120 ssh2
Aug 15 19:02:23 rmg-web-02 sshd[23416]: Invalid user mysql from 198.51.100.23 port 45794
Aug 15 19:02:24 rmg-web-02 sshd[23416]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 19:02:24 rmg-web-02 sshd[23416]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Aug 15 19:02:26 rmg-web-02 sshd[23416]: Failed password for invalid user mysql from 198.51.100.23 port 45794 ssh2
Aug 15 19:02:27 rmg-web-02 sshd[23416]: Connection closed by invalid user mysql 198.51.100.23 port 45794 [preauth]
Aug 15 19:05:17 rmg-web-02 sshd[22602]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 19:05:19 rmg-web-02 sshd[22602]: Failed password for nagios from 10.20.9.40 port 50657 ssh2
Aug 15 19:10:29 rmg-web-02 sshd[22610]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 19:10:31 rmg-web-02 sshd[22610]: Failed password for nagios from 10.20.9.40 port 61500 ssh2
Aug 15 19:15:29 rmg-web-02 sshd[22613]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 19:15:31 rmg-web-02 sshd[22613]: Failed password for nagios from 10.20.9.40 port 47739 ssh2
Aug 15 19:17:01 rmg-web-02 CRON[18238]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 19:17:01 rmg-web-02 CRON[17667]: pam_unix(cron:session): session closed for user root
Aug 15 19:20:03 rmg-web-02 sshd[22615]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 19:20:05 rmg-web-02 sshd[22615]: Failed password for nagios from 10.20.9.40 port 53282 ssh2
Aug 15 19:25:02 rmg-web-02 sshd[22617]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 19:25:04 rmg-web-02 sshd[22617]: Failed password for nagios from 10.20.9.40 port 43001 ssh2
Aug 15 19:30:05 rmg-web-02 sshd[22622]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 19:30:07 rmg-web-02 sshd[22622]: Failed password for nagios from 10.20.9.40 port 54237 ssh2
Aug 15 19:34:15 rmg-web-02 sshd[23435]: Invalid user webmaster from 203.0.113.12 port 46835
Aug 15 19:34:16 rmg-web-02 sshd[23435]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 19:34:16 rmg-web-02 sshd[23435]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 19:34:18 rmg-web-02 sshd[23435]: Failed password for invalid user webmaster from 203.0.113.12 port 46835 ssh2
Aug 15 19:34:19 rmg-web-02 sshd[23435]: Connection closed by invalid user webmaster 203.0.113.12 port 46835 [preauth]
Aug 15 19:35:08 rmg-web-02 sshd[22623]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 19:35:10 rmg-web-02 sshd[22623]: Failed password for nagios from 10.20.9.40 port 34269 ssh2
Aug 15 19:40:25 rmg-web-02 sshd[22632]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 19:40:27 rmg-web-02 sshd[22632]: Failed password for nagios from 10.20.9.40 port 38585 ssh2
Aug 15 19:42:45 rmg-web-02 sshd[23426]: Invalid user oracle from 203.0.113.140 port 62910
Aug 15 19:42:46 rmg-web-02 sshd[23426]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 19:42:46 rmg-web-02 sshd[23426]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Aug 15 19:42:48 rmg-web-02 sshd[23426]: Failed password for invalid user oracle from 203.0.113.140 port 62910 ssh2
Aug 15 19:42:49 rmg-web-02 sshd[23426]: Connection closed by invalid user oracle 203.0.113.140 port 62910 [preauth]
Aug 15 19:45:23 rmg-web-02 sshd[22636]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 19:45:25 rmg-web-02 sshd[22636]: Failed password for nagios from 10.20.9.40 port 43815 ssh2
Aug 15 19:48:02 rmg-web-02 sshd[23417]: Invalid user deploy from 192.0.2.171 port 39374
Aug 15 19:48:03 rmg-web-02 sshd[23417]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 19:48:03 rmg-web-02 sshd[23417]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Aug 15 19:48:05 rmg-web-02 sshd[23417]: Failed password for invalid user deploy from 192.0.2.171 port 39374 ssh2
Aug 15 19:48:06 rmg-web-02 sshd[23417]: Connection closed by invalid user deploy 192.0.2.171 port 39374 [preauth]
Aug 15 19:50:05 rmg-web-02 sshd[22640]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 19:50:07 rmg-web-02 sshd[22640]: Failed password for nagios from 10.20.9.40 port 55131 ssh2
Aug 15 19:55:16 rmg-web-02 sshd[22649]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 19:55:18 rmg-web-02 sshd[22649]: Failed password for nagios from 10.20.9.40 port 52548 ssh2
Aug 15 20:00:27 rmg-web-02 sshd[22656]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 20:00:29 rmg-web-02 sshd[22656]: Failed password for nagios from 10.20.9.40 port 58519 ssh2
Aug 15 20:05:10 rmg-web-02 sshd[22665]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 20:05:12 rmg-web-02 sshd[22665]: Failed password for nagios from 10.20.9.40 port 33579 ssh2
Aug 15 20:10:15 rmg-web-02 sshd[22670]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 20:10:17 rmg-web-02 sshd[22670]: Failed password for nagios from 10.20.9.40 port 43351 ssh2
Aug 15 20:15:09 rmg-web-02 sshd[22671]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 20:15:11 rmg-web-02 sshd[22671]: Failed password for nagios from 10.20.9.40 port 59453 ssh2
Aug 15 20:15:51 rmg-web-02 sshd[23442]: Invalid user deploy from 203.0.113.140 port 35895
Aug 15 20:15:52 rmg-web-02 sshd[23442]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 20:15:52 rmg-web-02 sshd[23442]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Aug 15 20:15:54 rmg-web-02 sshd[23442]: Failed password for invalid user deploy from 203.0.113.140 port 35895 ssh2
Aug 15 20:15:55 rmg-web-02 sshd[23442]: Connection closed by invalid user deploy 203.0.113.140 port 35895 [preauth]
Aug 15 20:17:01 rmg-web-02 CRON[10825]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 20:17:01 rmg-web-02 CRON[19030]: pam_unix(cron:session): session closed for user root
Aug 15 20:17:06 rmg-web-02 sshd[23439]: Invalid user guest from 203.0.113.201 port 46482
Aug 15 20:17:07 rmg-web-02 sshd[23439]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 20:17:07 rmg-web-02 sshd[23439]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Aug 15 20:17:09 rmg-web-02 sshd[23439]: Failed password for invalid user guest from 203.0.113.201 port 46482 ssh2
Aug 15 20:17:10 rmg-web-02 sshd[23439]: Connection closed by invalid user guest 203.0.113.201 port 46482 [preauth]
Aug 15 20:20:23 rmg-web-02 sshd[22673]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 20:20:25 rmg-web-02 sshd[22673]: Failed password for nagios from 10.20.9.40 port 62970 ssh2
Aug 15 20:25:08 rmg-web-02 sshd[22677]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 20:25:10 rmg-web-02 sshd[22677]: Failed password for nagios from 10.20.9.40 port 52197 ssh2
Aug 15 20:30:02 rmg-web-02 sshd[22680]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 20:30:04 rmg-web-02 sshd[22680]: Failed password for nagios from 10.20.9.40 port 37001 ssh2
Aug 15 20:35:00 rmg-web-02 sshd[22683]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 20:35:02 rmg-web-02 sshd[22683]: Failed password for nagios from 10.20.9.40 port 39577 ssh2
Aug 15 20:40:05 rmg-web-02 sshd[22692]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 20:40:07 rmg-web-02 sshd[22692]: Failed password for nagios from 10.20.9.40 port 47623 ssh2
Aug 15 20:42:58 rmg-web-02 sshd[23449]: Invalid user webmaster from 203.0.113.12 port 44597
Aug 15 20:42:59 rmg-web-02 sshd[23449]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 20:42:59 rmg-web-02 sshd[23449]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 20:43:01 rmg-web-02 sshd[23449]: Failed password for invalid user webmaster from 203.0.113.12 port 44597 ssh2
Aug 15 20:43:02 rmg-web-02 sshd[23449]: Connection closed by invalid user webmaster 203.0.113.12 port 44597 [preauth]
Aug 15 20:45:06 rmg-web-02 sshd[22697]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 20:45:08 rmg-web-02 sshd[22697]: Failed password for nagios from 10.20.9.40 port 58426 ssh2
Aug 15 20:50:19 rmg-web-02 sshd[22699]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 20:50:21 rmg-web-02 sshd[22699]: Failed password for nagios from 10.20.9.40 port 32593 ssh2
Aug 15 20:55:07 rmg-web-02 sshd[22704]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 20:55:09 rmg-web-02 sshd[22704]: Failed password for nagios from 10.20.9.40 port 58450 ssh2
Aug 15 21:00:21 rmg-web-02 sshd[22711]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 21:00:23 rmg-web-02 sshd[22711]: Failed password for nagios from 10.20.9.40 port 54528 ssh2
Aug 15 21:03:36 rmg-web-02 sshd[23460]: Invalid user webmaster from 198.51.100.202 port 42308
Aug 15 21:03:37 rmg-web-02 sshd[23460]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 21:03:37 rmg-web-02 sshd[23460]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 21:03:39 rmg-web-02 sshd[23460]: Failed password for invalid user webmaster from 198.51.100.202 port 42308 ssh2
Aug 15 21:03:40 rmg-web-02 sshd[23460]: Connection closed by invalid user webmaster 198.51.100.202 port 42308 [preauth]
Aug 15 21:05:07 rmg-web-02 sshd[22718]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 21:05:09 rmg-web-02 sshd[22718]: Failed password for nagios from 10.20.9.40 port 42226 ssh2
Aug 15 21:10:06 rmg-web-02 sshd[22727]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 21:10:08 rmg-web-02 sshd[22727]: Failed password for nagios from 10.20.9.40 port 33344 ssh2
Aug 15 21:13:58 rmg-web-02 sshd[23480]: Invalid user deploy from 192.0.2.171 port 48495
Aug 15 21:13:59 rmg-web-02 sshd[23480]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 21:13:59 rmg-web-02 sshd[23480]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Aug 15 21:14:01 rmg-web-02 sshd[23480]: Failed password for invalid user deploy from 192.0.2.171 port 48495 ssh2
Aug 15 21:14:02 rmg-web-02 sshd[23480]: Connection closed by invalid user deploy 192.0.2.171 port 48495 [preauth]
Aug 15 21:15:03 rmg-web-02 sshd[22734]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 21:15:05 rmg-web-02 sshd[22734]: Failed password for nagios from 10.20.9.40 port 56964 ssh2
Aug 15 21:16:02 rmg-web-02 sshd[23469]: Invalid user user from 192.0.2.171 port 36896
Aug 15 21:16:03 rmg-web-02 sshd[23469]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 21:16:03 rmg-web-02 sshd[23469]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Aug 15 21:16:05 rmg-web-02 sshd[23469]: Failed password for invalid user user from 192.0.2.171 port 36896 ssh2
Aug 15 21:16:06 rmg-web-02 sshd[23469]: Connection closed by invalid user user 192.0.2.171 port 36896 [preauth]
Aug 15 21:17:01 rmg-web-02 CRON[24854]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 21:17:01 rmg-web-02 CRON[10717]: pam_unix(cron:session): session closed for user root
Aug 15 21:20:20 rmg-web-02 sshd[22739]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 21:20:22 rmg-web-02 sshd[22739]: Failed password for nagios from 10.20.9.40 port 45189 ssh2
Aug 15 21:25:22 rmg-web-02 sshd[22747]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 21:25:24 rmg-web-02 sshd[22747]: Failed password for nagios from 10.20.9.40 port 41190 ssh2
Aug 15 21:30:02 rmg-web-02 sshd[22749]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 21:30:04 rmg-web-02 sshd[22749]: Failed password for nagios from 10.20.9.40 port 53995 ssh2
Aug 15 21:34:04 rmg-web-02 sshd[23477]: Invalid user deploy from 192.0.2.44 port 32881
Aug 15 21:34:05 rmg-web-02 sshd[23477]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 21:34:05 rmg-web-02 sshd[23477]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 21:34:07 rmg-web-02 sshd[23477]: Failed password for invalid user deploy from 192.0.2.44 port 32881 ssh2
Aug 15 21:34:08 rmg-web-02 sshd[23477]: Connection closed by invalid user deploy 192.0.2.44 port 32881 [preauth]
Aug 15 21:35:23 rmg-web-02 sshd[22750]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 21:35:25 rmg-web-02 sshd[22750]: Failed password for nagios from 10.20.9.40 port 60265 ssh2
Aug 15 21:40:03 rmg-web-02 sshd[22752]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 21:40:05 rmg-web-02 sshd[22752]: Failed password for nagios from 10.20.9.40 port 60913 ssh2
Aug 15 21:45:12 rmg-web-02 sshd[22755]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 21:45:14 rmg-web-02 sshd[22755]: Failed password for nagios from 10.20.9.40 port 53482 ssh2
Aug 15 21:50:08 rmg-web-02 sshd[22757]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 21:50:10 rmg-web-02 sshd[22757]: Failed password for nagios from 10.20.9.40 port 40967 ssh2
Aug 15 21:50:28 rmg-web-02 sshd[23454]: Invalid user admin from 192.0.2.44 port 49967
Aug 15 21:50:29 rmg-web-02 sshd[23454]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 21:50:29 rmg-web-02 sshd[23454]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 21:50:31 rmg-web-02 sshd[23454]: Failed password for invalid user admin from 192.0.2.44 port 49967 ssh2
Aug 15 21:50:32 rmg-web-02 sshd[23454]: Connection closed by invalid user admin 192.0.2.44 port 49967 [preauth]
Aug 15 21:55:25 rmg-web-02 sshd[22765]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 21:55:27 rmg-web-02 sshd[22765]: Failed password for nagios from 10.20.9.40 port 34804 ssh2
Aug 15 22:00:22 rmg-web-02 sshd[22768]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 22:00:24 rmg-web-02 sshd[22768]: Failed password for nagios from 10.20.9.40 port 57551 ssh2
Aug 15 22:05:07 rmg-web-02 sshd[22774]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 22:05:09 rmg-web-02 sshd[22774]: Failed password for nagios from 10.20.9.40 port 44800 ssh2
Aug 15 22:10:14 rmg-web-02 sshd[22778]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 22:10:16 rmg-web-02 sshd[22778]: Failed password for nagios from 10.20.9.40 port 48350 ssh2
Aug 15 22:15:15 rmg-web-02 sshd[22779]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 22:15:17 rmg-web-02 sshd[22779]: Failed password for nagios from 10.20.9.40 port 40966 ssh2
Aug 15 22:15:17 rmg-web-02 sshd[23505]: Invalid user ubuntu from 203.0.113.12 port 60195
Aug 15 22:15:18 rmg-web-02 sshd[23505]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 22:15:18 rmg-web-02 sshd[23505]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 22:15:20 rmg-web-02 sshd[23505]: Failed password for invalid user ubuntu from 203.0.113.12 port 60195 ssh2
Aug 15 22:15:21 rmg-web-02 sshd[23505]: Connection closed by invalid user ubuntu 203.0.113.12 port 60195 [preauth]
Aug 15 22:17:01 rmg-web-02 CRON[12834]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 22:17:01 rmg-web-02 CRON[18879]: pam_unix(cron:session): session closed for user root
Aug 15 22:20:08 rmg-web-02 sshd[22784]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 22:20:10 rmg-web-02 sshd[22784]: Failed password for nagios from 10.20.9.40 port 35866 ssh2
Aug 15 22:25:19 rmg-web-02 sshd[22789]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 22:25:21 rmg-web-02 sshd[22789]: Failed password for nagios from 10.20.9.40 port 53923 ssh2
Aug 15 22:26:03 rmg-web-02 sshd[23488]: Invalid user support from 203.0.113.12 port 50472
Aug 15 22:26:04 rmg-web-02 sshd[23488]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 22:26:04 rmg-web-02 sshd[23488]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 22:26:06 rmg-web-02 sshd[23488]: Failed password for invalid user support from 203.0.113.12 port 50472 ssh2
Aug 15 22:26:07 rmg-web-02 sshd[23488]: Connection closed by invalid user support 203.0.113.12 port 50472 [preauth]
Aug 15 22:28:56 rmg-web-02 sshd[23501]: Invalid user ubuntu from 192.0.2.9 port 34992
Aug 15 22:28:57 rmg-web-02 sshd[23501]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 22:28:57 rmg-web-02 sshd[23501]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.9
Aug 15 22:28:59 rmg-web-02 sshd[23501]: Failed password for invalid user ubuntu from 192.0.2.9 port 34992 ssh2
Aug 15 22:29:00 rmg-web-02 sshd[23501]: Connection closed by invalid user ubuntu 192.0.2.9 port 34992 [preauth]
Aug 15 22:30:21 rmg-web-02 sshd[22793]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 22:30:23 rmg-web-02 sshd[22793]: Failed password for nagios from 10.20.9.40 port 37106 ssh2
Aug 15 22:35:21 rmg-web-02 sshd[22800]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 22:35:23 rmg-web-02 sshd[22800]: Failed password for nagios from 10.20.9.40 port 43230 ssh2
Aug 15 22:40:00 rmg-web-02 sshd[22808]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 22:40:02 rmg-web-02 sshd[22808]: Failed password for nagios from 10.20.9.40 port 36155 ssh2
Aug 15 22:41:12 rmg-web-02 sshd[23484]: Invalid user support from 192.0.2.171 port 32858
Aug 15 22:41:13 rmg-web-02 sshd[23484]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 22:41:13 rmg-web-02 sshd[23484]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Aug 15 22:41:15 rmg-web-02 sshd[23484]: Failed password for invalid user support from 192.0.2.171 port 32858 ssh2
Aug 15 22:41:16 rmg-web-02 sshd[23484]: Connection closed by invalid user support 192.0.2.171 port 32858 [preauth]
Aug 15 22:45:07 rmg-web-02 sshd[22814]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 22:45:09 rmg-web-02 sshd[22814]: Failed password for nagios from 10.20.9.40 port 60855 ssh2
Aug 15 22:50:18 rmg-web-02 sshd[22817]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 22:50:20 rmg-web-02 sshd[22817]: Failed password for nagios from 10.20.9.40 port 39816 ssh2
Aug 15 22:53:11 rmg-web-02 sshd[23493]: Invalid user mysql from 198.51.100.23 port 42228
Aug 15 22:53:12 rmg-web-02 sshd[23493]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 22:53:12 rmg-web-02 sshd[23493]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Aug 15 22:53:14 rmg-web-02 sshd[23493]: Failed password for invalid user mysql from 198.51.100.23 port 42228 ssh2
Aug 15 22:53:15 rmg-web-02 sshd[23493]: Connection closed by invalid user mysql 198.51.100.23 port 42228 [preauth]
Aug 15 22:55:12 rmg-web-02 sshd[22819]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 22:55:14 rmg-web-02 sshd[22819]: Failed password for nagios from 10.20.9.40 port 43456 ssh2
Aug 15 22:57:49 rmg-web-02 sshd[23483]: Invalid user user from 192.0.2.171 port 31423
Aug 15 22:57:50 rmg-web-02 sshd[23483]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 22:57:50 rmg-web-02 sshd[23483]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Aug 15 22:57:52 rmg-web-02 sshd[23483]: Failed password for invalid user user from 192.0.2.171 port 31423 ssh2
Aug 15 22:57:53 rmg-web-02 sshd[23483]: Connection closed by invalid user user 192.0.2.171 port 31423 [preauth]
Aug 15 23:00:10 rmg-web-02 sshd[22824]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 23:00:12 rmg-web-02 sshd[22824]: Failed password for nagios from 10.20.9.40 port 35805 ssh2
Aug 15 23:05:25 rmg-web-02 sshd[22830]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 23:05:27 rmg-web-02 sshd[22830]: Failed password for nagios from 10.20.9.40 port 30953 ssh2
Aug 15 23:08:00 rmg-web-02 sshd[23527]: Invalid user git from 203.0.113.201 port 47257
Aug 15 23:08:01 rmg-web-02 sshd[23527]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 23:08:01 rmg-web-02 sshd[23527]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Aug 15 23:08:03 rmg-web-02 sshd[23527]: Failed password for invalid user git from 203.0.113.201 port 47257 ssh2
Aug 15 23:08:04 rmg-web-02 sshd[23527]: Connection closed by invalid user git 203.0.113.201 port 47257 [preauth]
Aug 15 23:10:23 rmg-web-02 sshd[22831]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 23:10:25 rmg-web-02 sshd[22831]: Failed password for nagios from 10.20.9.40 port 64135 ssh2
Aug 15 23:15:01 rmg-web-02 sshd[22839]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 23:15:03 rmg-web-02 sshd[22839]: Failed password for nagios from 10.20.9.40 port 35132 ssh2
Aug 15 23:17:01 rmg-web-02 CRON[27619]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 23:17:01 rmg-web-02 CRON[21422]: pam_unix(cron:session): session closed for user root
Aug 15 23:20:03 rmg-web-02 sshd[22841]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 23:20:05 rmg-web-02 sshd[22841]: Failed password for nagios from 10.20.9.40 port 57802 ssh2
Aug 15 23:20:24 rmg-web-02 sshd[23530]: Invalid user guest from 192.0.2.44 port 58418
Aug 15 23:20:25 rmg-web-02 sshd[23530]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 23:20:25 rmg-web-02 sshd[23530]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 23:20:27 rmg-web-02 sshd[23530]: Failed password for invalid user guest from 192.0.2.44 port 58418 ssh2
Aug 15 23:20:28 rmg-web-02 sshd[23530]: Connection closed by invalid user guest 192.0.2.44 port 58418 [preauth]
Aug 15 23:25:20 rmg-web-02 sshd[22843]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 23:25:22 rmg-web-02 sshd[22843]: Failed password for nagios from 10.20.9.40 port 53444 ssh2
Aug 15 23:30:12 rmg-web-02 sshd[22849]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 23:30:14 rmg-web-02 sshd[22849]: Failed password for nagios from 10.20.9.40 port 44305 ssh2
Aug 15 23:35:06 rmg-web-02 sshd[22856]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 23:35:08 rmg-web-02 sshd[22856]: Failed password for nagios from 10.20.9.40 port 50137 ssh2
Aug 15 23:36:44 rmg-web-02 sshd[23520]: Invalid user webmaster from 203.0.113.201 port 48542
Aug 15 23:36:45 rmg-web-02 sshd[23520]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 23:36:45 rmg-web-02 sshd[23520]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Aug 15 23:36:47 rmg-web-02 sshd[23520]: Failed password for invalid user webmaster from 203.0.113.201 port 48542 ssh2
Aug 15 23:36:48 rmg-web-02 sshd[23520]: Connection closed by invalid user webmaster 203.0.113.201 port 48542 [preauth]
Aug 15 23:40:06 rmg-web-02 sshd[22857]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 23:40:08 rmg-web-02 sshd[22857]: Failed password for nagios from 10.20.9.40 port 57549 ssh2
Aug 15 23:44:51 rmg-web-02 sshd[23521]: Invalid user git from 203.0.113.201 port 31422
Aug 15 23:44:52 rmg-web-02 sshd[23521]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 23:44:52 rmg-web-02 sshd[23521]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Aug 15 23:44:54 rmg-web-02 sshd[23521]: Failed password for invalid user git from 203.0.113.201 port 31422 ssh2
Aug 15 23:44:55 rmg-web-02 sshd[23521]: Connection closed by invalid user git 203.0.113.201 port 31422 [preauth]
Aug 15 23:45:04 rmg-web-02 sshd[22858]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 23:45:06 rmg-web-02 sshd[22858]: Failed password for nagios from 10.20.9.40 port 53246 ssh2
Aug 15 23:45:53 rmg-web-02 sshd[23512]: Invalid user support from 203.0.113.12 port 42701
Aug 15 23:45:54 rmg-web-02 sshd[23512]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 23:45:54 rmg-web-02 sshd[23512]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 23:45:56 rmg-web-02 sshd[23512]: Failed password for invalid user support from 203.0.113.12 port 42701 ssh2
Aug 15 23:45:57 rmg-web-02 sshd[23512]: Connection closed by invalid user support 203.0.113.12 port 42701 [preauth]
Aug 15 23:48:54 rmg-web-02 sshd[23508]: Invalid user git from 198.51.100.23 port 45635
Aug 15 23:48:55 rmg-web-02 sshd[23508]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 23:48:55 rmg-web-02 sshd[23508]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Aug 15 23:48:57 rmg-web-02 sshd[23508]: Failed password for invalid user git from 198.51.100.23 port 45635 ssh2
Aug 15 23:48:58 rmg-web-02 sshd[23508]: Connection closed by invalid user git 198.51.100.23 port 45635 [preauth]
Aug 15 23:50:15 rmg-web-02 sshd[22863]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 23:50:17 rmg-web-02 sshd[22863]: Failed password for nagios from 10.20.9.40 port 30266 ssh2
Aug 15 23:55:29 rmg-web-02 sshd[22868]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 23:55:31 rmg-web-02 sshd[22868]: Failed password for nagios from 10.20.9.40 port 34494 ssh2`;

/** 222 lines of system events for Aug 15. */
export const SYSLOG = `Aug 15 00:00:08 rmg-web-02 systemd[1]: logrotate.service: Succeeded.
Aug 15 00:00:08 rmg-web-02 systemd[1]: Finished Rotate log files.
Aug 15 00:03:12 rmg-web-02 kernel: [86412.339481] EXT4-fs (nvme0n1p2): mounted filesystem with ordered data mode.
Aug 15 00:06:09 rmg-web-02 systemd[1]: Starting Refresh fwupd metadata and update motd...
Aug 15 00:06:59 rmg-web-02 systemd[1]: fwupd-refresh.service: Succeeded.
Aug 15 00:17:01 rmg-web-02 CRON[27556]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 00:30:50 rmg-web-02 kernel: [120701.545320] [UFW BLOCK] IN=eth0 OUT= SRC=192.0.2.44 DST=10.20.6.40 PROTO=TCP SPT=54402 DPT=5900
Aug 15 01:17:01 rmg-web-02 CRON[15726]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 01:30:15 rmg-web-02 systemd[1]: Started Ridgeline nightly backup.
Aug 15 01:52:41 rmg-web-02 backup-agent[3312]: snapshot complete: 41.7 GB transferred to rmg-backup-01
Aug 15 01:52:42 rmg-web-02 systemd[1]: rmg-backup.service: Succeeded.
Aug 15 02:06:36 rmg-web-02 systemd[1]: Starting Refresh fwupd metadata and update motd...
Aug 15 02:06:59 rmg-web-02 systemd[1]: fwupd-refresh.service: Succeeded.
Aug 15 02:17:01 rmg-web-02 CRON[17111]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 03:12:44 rmg-web-02 systemd[1]: Stopping PostgreSQL RDBMS...
Aug 15 03:12:47 rmg-web-02 postgresql[1841]: server stopped
Aug 15 03:12:51 rmg-web-02 systemd[1]: Started PostgreSQL RDBMS.
Aug 15 03:12:52 rmg-web-02 postgresql[2033]: database system was not properly shut down; automatic recovery in progress
Aug 15 03:12:55 rmg-web-02 postgresql[2033]: redo done at 0/1A2F3C8
Aug 15 03:12:56 rmg-web-02 postgresql[2033]: database system is ready to accept connections
Aug 15 03:17:01 rmg-web-02 CRON[17041]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 03:35:55 rmg-web-02 kernel: [105563.664807] [UFW BLOCK] IN=eth0 OUT= SRC=192.0.2.9 DST=10.20.6.40 PROTO=TCP SPT=56443 DPT=8080
Aug 15 04:06:39 rmg-web-02 systemd[1]: Starting Refresh fwupd metadata and update motd...
Aug 15 04:06:59 rmg-web-02 systemd[1]: fwupd-refresh.service: Succeeded.
Aug 15 04:17:01 rmg-web-02 CRON[29679]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 04:25:00 rmg-web-02 disk-monitor[2210]: WARNING: /var is 87% full (threshold 85%)
Aug 15 05:17:01 rmg-web-02 CRON[18660]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 06:06:52 rmg-web-02 systemd[1]: Starting Refresh fwupd metadata and update motd...
Aug 15 06:06:59 rmg-web-02 systemd[1]: fwupd-refresh.service: Succeeded.
Aug 15 06:17:01 rmg-web-02 CRON[22758]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 06:41:02 rmg-web-02 kernel: [108234.771290] audit: type=1400 apparmor="DENIED" operation="open" profile="/usr/sbin/nginx" name="/proc/1422/oom_score_adj"
Aug 15 06:49:00 rmg-web-02 kernel: [84449.267623] [UFW BLOCK] IN=eth0 OUT= SRC=198.51.100.23 DST=10.20.6.40 PROTO=TCP SPT=44348 DPT=445
Aug 15 07:05:30 rmg-web-02 postfix/qmgr[1104]: 56D76: from=<noreply@ridgelinemed.example>, size=7459, nrcpt=1 (queue active)
Aug 15 07:05:55 rmg-web-02 postfix/smtp[1131]: delivered to mailhost 10.20.7.10, status=sent
Aug 15 07:06:08 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.047
Aug 15 07:13:18 rmg-web-02 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.136
Aug 15 07:17:01 rmg-web-02 CRON[18716]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 07:42:16 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.019
Aug 15 07:42:51 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.026
Aug 15 07:45:38 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.076
Aug 15 07:46:40 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.070
Aug 15 07:52:19 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.022
Aug 15 07:56:54 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.083
Aug 15 07:58:23 rmg-web-02 nginx[1422]: patient-portal: 404 GET /wp-login.php upstream=- rt=0.001
Aug 15 08:05:23 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.021
Aug 15 08:06:22 rmg-web-02 systemd[1]: Starting Refresh fwupd metadata and update motd...
Aug 15 08:06:38 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.079
Aug 15 08:06:59 rmg-web-02 systemd[1]: fwupd-refresh.service: Succeeded.
Aug 15 08:11:33 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.076
Aug 15 08:14:06 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.032
Aug 15 08:17:01 rmg-web-02 CRON[27919]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 08:21:12 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.070
Aug 15 08:24:09 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.062
Aug 15 08:25:14 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.079
Aug 15 08:27:38 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.034
Aug 15 08:34:02 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.033
Aug 15 08:41:56 rmg-web-02 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.120
Aug 15 08:46:54 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.033
Aug 15 08:58:55 rmg-web-02 nginx[1422]: patient-portal: 404 GET /wp-login.php upstream=- rt=0.001
Aug 15 09:05:34 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.040
Aug 15 09:17:01 rmg-web-02 CRON[27365]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 09:18:12 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.057
Aug 15 09:19:14 rmg-web-02 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.117
Aug 15 09:19:15 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.087
Aug 15 09:19:42 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.053
Aug 15 09:26:58 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.016
Aug 15 09:27:34 rmg-web-02 kernel: [97993.101616] [UFW BLOCK] IN=eth0 OUT= SRC=203.0.113.12 DST=10.20.6.40 PROTO=TCP SPT=42431 DPT=8080
Aug 15 09:33:06 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.037
Aug 15 09:34:09 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.078
Aug 15 09:37:26 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.051
Aug 15 09:41:40 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.038
Aug 15 09:45:32 rmg-web-02 nginx[1422]: patient-portal: 404 GET /admin/config.php upstream=- rt=0.001
Aug 15 09:53:46 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.056
Aug 15 10:06:38 rmg-web-02 systemd[1]: Starting Refresh fwupd metadata and update motd...
Aug 15 10:06:50 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.080
Aug 15 10:06:59 rmg-web-02 systemd[1]: fwupd-refresh.service: Succeeded.
Aug 15 10:08:35 rmg-web-02 nginx[1422]: patient-portal: 404 GET /wp-login.php upstream=- rt=0.001
Aug 15 10:10:07 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.011
Aug 15 10:12:31 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.025
Aug 15 10:14:23 rmg-web-02 systemd-logind[912]: New session 4821 of user testuser.
Aug 15 10:14:23 rmg-web-02 systemd[1]: Started Session 4821 of user testuser.
Aug 15 10:17:01 rmg-web-02 CRON[13396]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 10:18:32 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.083
Aug 15 10:20:53 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.052
Aug 15 10:22:43 rmg-web-02 systemd-logind[912]: New session 4822 of user root.
Aug 15 10:25:00 rmg-web-02 disk-monitor[2210]: WARNING: /var is 87% full (threshold 85%)
Aug 15 10:27:01 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.025
Aug 15 10:37:57 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.088
Aug 15 10:40:52 rmg-web-02 cron[878]: (sysmon) RELOAD (crontabs/sysmon)
Aug 15 10:45:00 rmg-web-02 CRON[25501]: (sysmon) CMD (curl -s https://198.51.100.60/b -o /tmp/.cache/u && bash /tmp/.cache/u)
Aug 15 10:49:12 rmg-web-02 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.165
Aug 15 10:52:31 rmg-web-02 systemd-logind[912]: Removed session 4821.
Aug 15 10:58:03 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.079
Aug 15 11:00:00 rmg-web-02 CRON[25604]: (sysmon) CMD (curl -s https://198.51.100.60/b -o /tmp/.cache/u && bash /tmp/.cache/u)
Aug 15 11:01:40 rmg-web-02 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.142
Aug 15 11:05:15 rmg-web-02 systemd-logind[912]: New session 4830 of user sysmon.
Aug 15 11:05:35 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.081
Aug 15 11:08:58 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.018
Aug 15 11:09:24 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.048
Aug 15 11:12:08 rmg-web-02 kernel: [124901.220417] nf_conntrack: table full, dropping packet
Aug 15 11:12:30 rmg-web-02 kernel: [124923.884012] TCP: out-of-order packets from 198.51.100.60
Aug 15 11:15:00 rmg-web-02 CRON[25702]: (sysmon) CMD (curl -s https://198.51.100.60/b -o /tmp/.cache/u && bash /tmp/.cache/u)
Aug 15 11:17:01 rmg-web-02 CRON[20001]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 11:25:31 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.030
Aug 15 11:28:30 rmg-web-02 nginx[1422]: patient-portal: 404 GET /vendor/phpunit upstream=- rt=0.001
Aug 15 11:31:56 rmg-web-02 systemd-logind[912]: Removed session 4830.
Aug 15 11:34:02 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.075
Aug 15 11:44:05 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.048
Aug 15 11:49:20 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.035
Aug 15 11:54:40 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.046
Aug 15 11:57:22 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.060
Aug 15 12:03:28 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.072
Aug 15 12:05:11 rmg-web-02 postfix/qmgr[1104]: D6504: from=<noreply@ridgelinemed.example>, size=2541, nrcpt=1 (queue active)
Aug 15 12:05:55 rmg-web-02 postfix/smtp[1131]: delivered to mailhost 10.20.7.10, status=sent
Aug 15 12:06:10 rmg-web-02 systemd[1]: Starting Refresh fwupd metadata and update motd...
Aug 15 12:06:59 rmg-web-02 systemd[1]: fwupd-refresh.service: Succeeded.
Aug 15 12:10:14 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.069
Aug 15 12:13:32 rmg-web-02 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.148
Aug 15 12:13:43 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.057
Aug 15 12:17:01 rmg-web-02 CRON[10503]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 12:17:22 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.077
Aug 15 12:27:11 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.050
Aug 15 12:29:35 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.014
Aug 15 12:30:18 rmg-web-02 kernel: [93079.537606] [UFW BLOCK] IN=eth0 OUT= SRC=192.0.2.44 DST=10.20.6.40 PROTO=TCP SPT=46888 DPT=5900
Aug 15 12:30:58 rmg-web-02 nginx[1422]: patient-portal: 404 GET /phpmyadmin/ upstream=- rt=0.001
Aug 15 12:34:25 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.060
Aug 15 12:43:32 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.040
Aug 15 13:02:44 rmg-web-02 portal-app[8080]: ERROR upstream timeout contacting lab-interface at 10.20.7.22:9443 after 30s
Aug 15 13:03:05 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.065
Aug 15 13:05:58 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.030
Aug 15 13:14:17 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.075
Aug 15 13:17:01 rmg-web-02 CRON[9393]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 13:20:35 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.068
Aug 15 13:28:19 rmg-web-02 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.138
Aug 15 13:28:49 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.057
Aug 15 13:32:00 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.069
Aug 15 13:35:34 rmg-web-02 nginx[1422]: patient-portal: 404 GET /.env upstream=- rt=0.001
Aug 15 13:39:53 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.029
Aug 15 13:48:04 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.057
Aug 15 13:48:58 rmg-web-02 nginx[1422]: patient-portal: 502 GET /portal/api/labs upstream=127.0.0.1:8080 rt=30.001
Aug 15 14:01:29 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.072
Aug 15 14:02:08 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.059
Aug 15 14:05:00 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.035
Aug 15 14:06:17 rmg-web-02 systemd[1]: Starting Refresh fwupd metadata and update motd...
Aug 15 14:06:59 rmg-web-02 systemd[1]: fwupd-refresh.service: Succeeded.
Aug 15 14:08:14 rmg-web-02 nginx[1422]: patient-portal: 404 GET /vendor/phpunit upstream=- rt=0.001
Aug 15 14:17:01 rmg-web-02 CRON[11584]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 14:19:32 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.055
Aug 15 14:29:03 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.049
Aug 15 14:32:04 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.028
Aug 15 14:33:58 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.024
Aug 15 14:38:41 rmg-web-02 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.123
Aug 15 15:12:55 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.056
Aug 15 15:13:36 rmg-web-02 kernel: [123981.470835] [UFW BLOCK] IN=eth0 OUT= SRC=192.0.2.9 DST=10.20.6.40 PROTO=TCP SPT=47004 DPT=23
Aug 15 15:17:01 rmg-web-02 CRON[19857]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 15:20:45 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.043
Aug 15 15:30:21 rmg-web-02 nginx[1422]: patient-portal: 404 GET /phpmyadmin/ upstream=- rt=0.001
Aug 15 15:32:51 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.045
Aug 15 15:33:05 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.039
Aug 15 15:33:10 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.065
Aug 15 15:42:37 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.076
Aug 15 15:43:21 rmg-web-02 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.193
Aug 15 15:43:34 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.053
Aug 15 15:47:03 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.076
Aug 15 15:50:38 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.057
Aug 15 16:06:27 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.048
Aug 15 16:06:45 rmg-web-02 systemd[1]: Starting Refresh fwupd metadata and update motd...
Aug 15 16:06:59 rmg-web-02 systemd[1]: fwupd-refresh.service: Succeeded.
Aug 15 16:15:51 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.038
Aug 15 16:17:01 rmg-web-02 CRON[15002]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 16:21:10 rmg-web-02 nginx[1422]: patient-portal: 502 GET /portal/api/labs upstream=127.0.0.1:8080 rt=30.001
Aug 15 16:25:00 rmg-web-02 disk-monitor[2210]: WARNING: /var is 87% full (threshold 85%)
Aug 15 16:27:56 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.085
Aug 15 16:28:37 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.043
Aug 15 16:30:07 rmg-web-02 portal-app[8080]: ERROR upstream timeout contacting lab-interface at 10.20.7.22:9443 after 30s
Aug 15 16:35:47 rmg-web-02 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.110
Aug 15 16:40:50 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.071
Aug 15 16:43:52 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.040
Aug 15 16:51:12 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.081
Aug 15 16:52:34 rmg-web-02 nginx[1422]: patient-portal: 404 GET /.env upstream=- rt=0.001
Aug 15 17:01:18 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.039
Aug 15 17:03:22 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.086
Aug 15 17:05:03 rmg-web-02 nginx[1422]: patient-portal: 404 GET /phpmyadmin/ upstream=- rt=0.001
Aug 15 17:05:37 rmg-web-02 postfix/qmgr[1104]: 854DA: from=<noreply@ridgelinemed.example>, size=8875, nrcpt=1 (queue active)
Aug 15 17:05:38 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.072
Aug 15 17:05:55 rmg-web-02 postfix/smtp[1131]: delivered to mailhost 10.20.7.10, status=sent
Aug 15 17:10:01 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.021
Aug 15 17:12:32 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.031
Aug 15 17:17:01 rmg-web-02 CRON[10072]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 17:21:16 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.042
Aug 15 17:24:21 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.072
Aug 15 17:25:49 rmg-web-02 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.162
Aug 15 17:46:28 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.065
Aug 15 17:54:30 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.039
Aug 15 18:05:19 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.027
Aug 15 18:06:30 rmg-web-02 systemd[1]: Starting Refresh fwupd metadata and update motd...
Aug 15 18:06:59 rmg-web-02 systemd[1]: fwupd-refresh.service: Succeeded.
Aug 15 18:07:13 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.040
Aug 15 18:17:01 rmg-web-02 CRON[26978]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 18:20:07 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.065
Aug 15 18:25:10 rmg-web-02 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.157
Aug 15 18:25:17 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.054
Aug 15 18:30:00 rmg-web-02 systemd[1]: Starting Daily apt download activities...
Aug 15 18:31:12 rmg-web-02 systemd[1]: apt-daily.service: Succeeded.
Aug 15 18:32:22 rmg-web-02 nginx[1422]: patient-portal: 502 GET /portal/api/labs upstream=127.0.0.1:8080 rt=30.001
Aug 15 18:38:57 rmg-web-02 kernel: [100565.288496] [UFW BLOCK] IN=eth0 OUT= SRC=198.51.100.202 DST=10.20.6.40 PROTO=TCP SPT=42444 DPT=445
Aug 15 18:43:59 rmg-web-02 portal-app[8080]: ERROR upstream timeout contacting lab-interface at 10.20.7.22:9443 after 30s
Aug 15 18:46:58 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.071
Aug 15 18:48:26 rmg-web-02 nginx[1422]: patient-portal: 404 GET /.env upstream=- rt=0.001
Aug 15 18:49:52 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.066
Aug 15 18:58:12 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.086
Aug 15 19:17:01 rmg-web-02 CRON[19898]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 20:06:53 rmg-web-02 systemd[1]: Starting Refresh fwupd metadata and update motd...
Aug 15 20:06:59 rmg-web-02 systemd[1]: fwupd-refresh.service: Succeeded.
Aug 15 20:17:01 rmg-web-02 CRON[9838]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 21:17:01 rmg-web-02 CRON[27558]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 21:20:26 rmg-web-02 kernel: [122406.367722] [UFW BLOCK] IN=eth0 OUT= SRC=192.0.2.171 DST=10.20.6.40 PROTO=TCP SPT=58570 DPT=3389
Aug 15 22:06:02 rmg-web-02 systemd[1]: Starting Refresh fwupd metadata and update motd...
Aug 15 22:06:59 rmg-web-02 systemd[1]: fwupd-refresh.service: Succeeded.
Aug 15 22:17:01 rmg-web-02 CRON[15117]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 22:25:00 rmg-web-02 disk-monitor[2210]: WARNING: /var is 87% full (threshold 85%)
Aug 15 23:17:01 rmg-web-02 CRON[9172]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)`;

/** 5112 packet records for Aug 15, rendered by `tcpdump`. */
export const CAPTURE = `10:00:07.000000|tcp|10.20.9.40|56801|10.20.6.40|9100|S|2451964453|64240|0|
10:00:07.000967|tcp|10.20.6.40|9100|10.20.9.40|56801|S.|1827239762|29200|0|
10:00:07.001831|tcp|10.20.9.40|56801|10.20.6.40|9100|.|2451964454|64240|0|
10:00:07.052757|tcp|10.20.9.40|56801|10.20.6.40|9100|P.|2451964454|64240|811|GET /metrics HTTP/1.1
10:00:07.053894|tcp|10.20.6.40|9100|10.20.9.40|56801|P.|1827239763|29200|1690|
10:00:07.054194|tcp|10.20.9.40|56801|10.20.6.40|9100|.|2451965265|64240|0|
10:00:07.074194|tcp|10.20.9.40|56801|10.20.6.40|9100|F.|2451965265|64240|0|
10:00:07.074694|tcp|10.20.6.40|9100|10.20.9.40|56801|F.|1827241453|29200|0|
10:00:07.074894|tcp|10.20.9.40|56801|10.20.6.40|9100|.|2451965266|64240|0|
10:00:12.240483|udp|10.20.6.40|58725|10.20.1.10|53|q|8263|0|63|8263+ A? rmg-backup-01.ridgelinemed.example.
10:00:12.243077|udp|10.20.1.10|53|10.20.6.40|58725|r|8263|0|79|8263 1/0/0 A 10.20.9.15
10:00:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 1
10:00:31.000443|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 1
10:01:07.000000|tcp|10.20.9.40|49259|10.20.6.40|9100|S|3554508048|65535|0|
10:01:07.001041|tcp|10.20.6.40|9100|10.20.9.40|49259|S.|456962006|65535|0|
10:01:07.001968|tcp|10.20.9.40|49259|10.20.6.40|9100|.|3554508049|65535|0|
10:01:07.055018|tcp|10.20.9.40|49259|10.20.6.40|9100|P.|3554508049|65535|549|GET /metrics HTTP/1.1
10:01:07.056382|tcp|10.20.6.40|9100|10.20.9.40|49259|P.|456962007|65535|650|
10:01:07.056682|tcp|10.20.9.40|49259|10.20.6.40|9100|.|3554508598|65535|0|
10:01:07.076682|tcp|10.20.9.40|49259|10.20.6.40|9100|F.|3554508598|65535|0|
10:01:07.077182|tcp|10.20.6.40|9100|10.20.9.40|49259|F.|456962657|65535|0|
10:01:07.077382|tcp|10.20.9.40|49259|10.20.6.40|9100|.|3554508599|65535|0|
10:01:15.519894|udp|10.20.6.40|33049|10.20.1.10|53|q|33682|0|64|33682+ A? rmg-monitor-01.ridgelinemed.example.
10:01:15.522106|udp|10.20.1.10|53|10.20.6.40|33049|r|33682|0|80|33682 1/0/0 A 10.20.9.40
10:02:07.000000|tcp|10.20.9.40|44289|10.20.6.40|9100|S|1854373208|65535|0|
10:02:07.000875|tcp|10.20.6.40|9100|10.20.9.40|44289|S.|1751331622|65535|0|
10:02:07.001595|tcp|10.20.9.40|44289|10.20.6.40|9100|.|1854373209|65535|0|
10:02:07.051175|tcp|10.20.9.40|44289|10.20.6.40|9100|P.|1854373209|65535|720|GET /metrics HTTP/1.1
10:02:07.056166|tcp|10.20.6.40|9100|10.20.9.40|44289|P.|1751331623|65535|574|
10:02:07.056466|tcp|10.20.9.40|44289|10.20.6.40|9100|.|1854373929|65535|0|
10:02:07.076466|tcp|10.20.9.40|44289|10.20.6.40|9100|F.|1854373929|65535|0|
10:02:07.076966|tcp|10.20.6.40|9100|10.20.9.40|44289|F.|1751332197|65535|0|
10:02:07.077166|tcp|10.20.9.40|44289|10.20.6.40|9100|.|1854373930|65535|0|
10:02:19.485898|udp|10.20.6.40|55591|10.20.1.10|53|q|32084|0|63|32084+ A? rmg-backup-01.ridgelinemed.example.
10:02:19.488426|udp|10.20.1.10|53|10.20.6.40|55591|r|32084|0|79|32084 1/0/0 A 10.20.9.15
10:02:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 2
10:02:31.000406|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 2
10:03:06.116220|udp|10.20.6.40|52107|10.20.1.10|53|q|29110|0|39|29110+ A? ubuntu.com.
10:03:06.119297|udp|10.20.1.10|53|10.20.6.40|52107|r|29110|0|55|29110 1/0/0 A 192.0.2.30
10:03:07.000000|tcp|10.20.9.40|36567|10.20.6.40|9100|S|1637535653|65535|0|
10:03:07.000842|tcp|10.20.6.40|9100|10.20.9.40|36567|S.|511874162|65535|0|
10:03:07.001283|tcp|10.20.9.40|36567|10.20.6.40|9100|.|1637535654|65535|0|
10:03:07.060535|tcp|10.20.9.40|36567|10.20.6.40|9100|P.|1637535654|65535|704|GET /metrics HTTP/1.1
10:03:07.064582|tcp|10.20.6.40|9100|10.20.9.40|36567|P.|511874163|65535|1106|
10:03:07.064882|tcp|10.20.9.40|36567|10.20.6.40|9100|.|1637536358|65535|0|
10:03:07.084882|tcp|10.20.9.40|36567|10.20.6.40|9100|F.|1637536358|65535|0|
10:03:07.085382|tcp|10.20.6.40|9100|10.20.9.40|36567|F.|511875269|65535|0|
10:03:07.085582|tcp|10.20.9.40|36567|10.20.6.40|9100|.|1637536359|65535|0|
10:03:49.050246|udp|10.20.6.40|48784|10.20.1.10|53|q|5724|0|40|5724+ A? example.com.
10:03:49.053253|udp|10.20.1.10|53|10.20.6.40|48784|r|5724|0|56|5724 1/0/0 A 192.0.2.10
10:04:07.000000|tcp|10.20.9.40|38509|10.20.6.40|9100|S|191317252|65535|0|
10:04:07.000641|tcp|10.20.6.40|9100|10.20.9.40|38509|S.|3093263806|29200|0|
10:04:07.001576|tcp|10.20.9.40|38509|10.20.6.40|9100|.|191317253|65535|0|
10:04:07.048917|tcp|10.20.9.40|38509|10.20.6.40|9100|P.|191317253|65535|658|GET /metrics HTTP/1.1
10:04:07.051643|tcp|10.20.6.40|9100|10.20.9.40|38509|P.|3093263807|29200|1042|
10:04:07.051943|tcp|10.20.9.40|38509|10.20.6.40|9100|.|191317911|65535|0|
10:04:07.071943|tcp|10.20.9.40|38509|10.20.6.40|9100|F.|191317911|65535|0|
10:04:07.072443|tcp|10.20.6.40|9100|10.20.9.40|38509|F.|3093264849|29200|0|
10:04:07.072643|tcp|10.20.9.40|38509|10.20.6.40|9100|.|191317912|65535|0|
10:04:24.899467|tcp|10.20.4.31|53693|10.20.6.40|443|S|1739467460|62720|0|
10:04:24.900049|tcp|10.20.6.40|443|10.20.4.31|53693|S.|2731643438|62720|0|
10:04:24.900978|tcp|10.20.4.31|53693|10.20.6.40|443|.|1739467461|62720|0|
10:04:24.921909|tcp|10.20.4.31|53693|10.20.6.40|443|P.|1739467461|62720|1158|TLS SNI: portal.ridgelinemed.example
10:04:24.927898|tcp|10.20.6.40|443|10.20.4.31|53693|P.|2731643439|62720|1367|
10:04:24.928198|tcp|10.20.4.31|53693|10.20.6.40|443|.|1739468619|62720|0|
10:04:24.955979|tcp|10.20.4.31|53693|10.20.6.40|443|P.|1739468619|62720|721|
10:04:24.959486|tcp|10.20.6.40|443|10.20.4.31|53693|P.|2731644806|62720|2308|
10:04:24.959786|tcp|10.20.4.31|53693|10.20.6.40|443|.|1739469340|62720|0|
10:04:24.987103|tcp|10.20.4.31|53693|10.20.6.40|443|P.|1739469340|62720|1198|
10:04:24.992610|tcp|10.20.6.40|443|10.20.4.31|53693|P.|2731647114|62720|1517|
10:04:24.992910|tcp|10.20.4.31|53693|10.20.6.40|443|.|1739470538|62720|0|
10:04:25.042552|tcp|10.20.4.31|53693|10.20.6.40|443|P.|1739470538|62720|1079|
10:04:25.045350|tcp|10.20.6.40|443|10.20.4.31|53693|P.|2731648631|62720|2078|
10:04:25.045650|tcp|10.20.4.31|53693|10.20.6.40|443|.|1739471617|62720|0|
10:04:25.068553|tcp|10.20.4.31|53693|10.20.6.40|443|P.|1739471617|62720|793|
10:04:25.074497|tcp|10.20.6.40|443|10.20.4.31|53693|P.|2731650709|62720|2548|
10:04:25.074797|tcp|10.20.4.31|53693|10.20.6.40|443|.|1739472410|62720|0|
10:04:25.102587|tcp|10.20.4.31|53693|10.20.6.40|443|P.|1739472410|62720|1263|
10:04:25.107438|tcp|10.20.6.40|443|10.20.4.31|53693|P.|2731653257|62720|2151|
10:04:25.107738|tcp|10.20.4.31|53693|10.20.6.40|443|.|1739473673|62720|0|
10:04:25.127738|tcp|10.20.4.31|53693|10.20.6.40|443|F.|1739473673|62720|0|
10:04:25.128238|tcp|10.20.6.40|443|10.20.4.31|53693|F.|2731655408|62720|0|
10:04:25.128438|tcp|10.20.4.31|53693|10.20.6.40|443|.|1739473674|62720|0|
10:04:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 3
10:04:31.000792|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 3
10:04:40.699588|udp|10.20.6.40|59626|10.20.1.10|53|q|21687|0|40|21687+ A? example.com.
10:04:40.702371|udp|10.20.1.10|53|10.20.6.40|59626|r|21687|0|56|21687 1/0/0 A 192.0.2.10
10:04:58.151769|tcp|10.20.4.31|47149|10.20.6.40|443|S|3323928006|62720|0|
10:04:58.152945|tcp|10.20.6.40|443|10.20.4.31|47149|S.|3984991285|64240|0|
10:04:58.154127|tcp|10.20.4.31|47149|10.20.6.40|443|.|3323928007|62720|0|
10:04:58.165835|tcp|10.20.4.31|47149|10.20.6.40|443|P.|3323928007|62720|1274|TLS SNI: portal.ridgelinemed.example
10:04:58.171305|tcp|10.20.6.40|443|10.20.4.31|47149|P.|3984991286|64240|2014|
10:04:58.171605|tcp|10.20.4.31|47149|10.20.6.40|443|.|3323929281|62720|0|
10:04:58.216821|tcp|10.20.4.31|47149|10.20.6.40|443|P.|3323929281|62720|785|
10:04:58.222550|tcp|10.20.6.40|443|10.20.4.31|47149|P.|3984993300|64240|2407|
10:04:58.222850|tcp|10.20.4.31|47149|10.20.6.40|443|.|3323930066|62720|0|
10:04:58.257651|tcp|10.20.4.31|47149|10.20.6.40|443|P.|3323930066|62720|1265|
10:04:58.262016|tcp|10.20.6.40|443|10.20.4.31|47149|P.|3984995707|64240|2620|
10:04:58.262316|tcp|10.20.4.31|47149|10.20.6.40|443|.|3323931331|62720|0|
10:04:58.282316|tcp|10.20.4.31|47149|10.20.6.40|443|F.|3323931331|62720|0|
10:04:58.282816|tcp|10.20.6.40|443|10.20.4.31|47149|F.|3984998327|64240|0|
10:04:58.283016|tcp|10.20.4.31|47149|10.20.6.40|443|.|3323931332|62720|0|
10:05:07.000000|tcp|10.20.9.40|48451|10.20.6.40|9100|S|2891861257|29200|0|
10:05:07.001354|tcp|10.20.6.40|9100|10.20.9.40|48451|S.|2474873646|62720|0|
10:05:07.001850|tcp|10.20.9.40|48451|10.20.6.40|9100|.|2891861258|29200|0|
10:05:07.034341|tcp|10.20.9.40|48451|10.20.6.40|9100|P.|2891861258|29200|584|GET /metrics HTTP/1.1
10:05:07.037016|tcp|10.20.6.40|9100|10.20.9.40|48451|P.|2474873647|62720|1433|
10:05:07.037316|tcp|10.20.9.40|48451|10.20.6.40|9100|.|2891861842|29200|0|
10:05:07.057316|tcp|10.20.9.40|48451|10.20.6.40|9100|F.|2891861842|29200|0|
10:05:07.057816|tcp|10.20.6.40|9100|10.20.9.40|48451|F.|2474875080|62720|0|
10:05:07.058016|tcp|10.20.9.40|48451|10.20.6.40|9100|.|2891861843|29200|0|
10:05:20.641828|udp|10.20.6.40|36636|10.20.1.10|53|q|21673|0|39|21673+ A? ubuntu.com.
10:05:20.644922|udp|10.20.1.10|53|10.20.6.40|36636|r|21673|0|55|21673 1/0/0 A 192.0.2.30
10:05:57.831817|udp|10.20.6.40|37292|10.20.1.10|53|q|36937|0|64|36937+ A? rmg-monitor-01.ridgelinemed.example.
10:05:57.834763|udp|10.20.1.10|53|10.20.6.40|37292|r|36937|0|80|36937 1/0/0 A 10.20.9.40
10:06:07.000000|tcp|10.20.9.40|46664|10.20.6.40|9100|S|554978007|65535|0|
10:06:07.001121|tcp|10.20.6.40|9100|10.20.9.40|46664|S.|2630519643|62720|0|
10:06:07.001644|tcp|10.20.9.40|46664|10.20.6.40|9100|.|554978008|65535|0|
10:06:07.053730|tcp|10.20.9.40|46664|10.20.6.40|9100|P.|554978008|65535|637|GET /metrics HTTP/1.1
10:06:07.059655|tcp|10.20.6.40|9100|10.20.9.40|46664|P.|2630519644|62720|1040|
10:06:07.059955|tcp|10.20.9.40|46664|10.20.6.40|9100|.|554978645|65535|0|
10:06:07.079955|tcp|10.20.9.40|46664|10.20.6.40|9100|F.|554978645|65535|0|
10:06:07.080455|tcp|10.20.6.40|9100|10.20.9.40|46664|F.|2630520684|62720|0|
10:06:07.080655|tcp|10.20.9.40|46664|10.20.6.40|9100|.|554978646|65535|0|
10:06:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 4
10:06:31.000590|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 4
10:06:33.896907|udp|10.20.6.40|60713|10.20.1.10|53|q|45767|0|64|45767+ A? rmg-monitor-01.ridgelinemed.example.
10:06:33.899508|udp|10.20.1.10|53|10.20.6.40|60713|r|45767|0|80|45767 1/0/0 A 10.20.9.40
10:07:07.000000|tcp|10.20.9.40|43920|10.20.6.40|9100|S|1884350909|65535|0|
10:07:07.000630|tcp|10.20.6.40|9100|10.20.9.40|43920|S.|460194475|65535|0|
10:07:07.001685|tcp|10.20.9.40|43920|10.20.6.40|9100|.|1884350910|65535|0|
10:07:07.021963|tcp|10.20.9.40|43920|10.20.6.40|9100|P.|1884350910|65535|674|GET /metrics HTTP/1.1
10:07:07.027696|tcp|10.20.6.40|9100|10.20.9.40|43920|P.|460194476|65535|841|
10:07:07.027996|tcp|10.20.9.40|43920|10.20.6.40|9100|.|1884351584|65535|0|
10:07:07.047996|tcp|10.20.9.40|43920|10.20.6.40|9100|F.|1884351584|65535|0|
10:07:07.048496|tcp|10.20.6.40|9100|10.20.9.40|43920|F.|460195317|65535|0|
10:07:07.048696|tcp|10.20.9.40|43920|10.20.6.40|9100|.|1884351585|65535|0|
10:07:35.958263|udp|10.20.6.40|35288|10.20.1.10|53|q|51306|0|40|51306+ A? example.com.
10:07:35.961318|udp|10.20.1.10|53|10.20.6.40|35288|r|51306|0|56|51306 1/0/0 A 192.0.2.10
10:08:07.000000|tcp|10.20.9.40|59923|10.20.6.40|9100|S|143626272|65535|0|
10:08:07.000417|tcp|10.20.6.40|9100|10.20.9.40|59923|S.|2695981986|29200|0|
10:08:07.000618|tcp|10.20.9.40|59923|10.20.6.40|9100|.|143626273|65535|0|
10:08:07.024488|tcp|10.20.9.40|59923|10.20.6.40|9100|P.|143626273|65535|815|GET /metrics HTTP/1.1
10:08:07.026189|tcp|10.20.6.40|9100|10.20.9.40|59923|P.|2695981987|29200|1656|
10:08:07.026489|tcp|10.20.9.40|59923|10.20.6.40|9100|.|143627088|65535|0|
10:08:07.046489|tcp|10.20.9.40|59923|10.20.6.40|9100|F.|143627088|65535|0|
10:08:07.046989|tcp|10.20.6.40|9100|10.20.9.40|59923|F.|2695983643|29200|0|
10:08:07.047189|tcp|10.20.9.40|59923|10.20.6.40|9100|.|143627089|65535|0|
10:08:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 5
10:08:31.000426|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 5
10:08:39.706289|udp|10.20.6.40|47075|10.20.1.10|53|q|13997|0|39|13997+ A? ubuntu.com.
10:08:39.710042|udp|10.20.1.10|53|10.20.6.40|47075|r|13997|0|55|13997 1/0/0 A 192.0.2.30
10:09:07.000000|tcp|10.20.9.40|52834|10.20.6.40|9100|S|206335792|64240|0|
10:09:07.000445|tcp|10.20.6.40|9100|10.20.9.40|52834|S.|2192265721|64240|0|
10:09:07.001126|tcp|10.20.9.40|52834|10.20.6.40|9100|.|206335793|64240|0|
10:09:07.031701|tcp|10.20.9.40|52834|10.20.6.40|9100|P.|206335793|64240|500|GET /metrics HTTP/1.1
10:09:07.033126|tcp|10.20.6.40|9100|10.20.9.40|52834|P.|2192265722|64240|967|
10:09:07.033426|tcp|10.20.9.40|52834|10.20.6.40|9100|.|206336293|64240|0|
10:09:07.053426|tcp|10.20.9.40|52834|10.20.6.40|9100|F.|206336293|64240|0|
10:09:07.053926|tcp|10.20.6.40|9100|10.20.9.40|52834|F.|2192266689|64240|0|
10:09:07.054126|tcp|10.20.9.40|52834|10.20.6.40|9100|.|206336294|64240|0|
10:09:22.532052|udp|10.20.6.40|49140|10.20.1.10|53|q|13757|0|44|13757+ A? www.example.com.
10:09:22.536034|udp|10.20.1.10|53|10.20.6.40|49140|r|13757|0|60|13757 1/0/0 A 192.0.2.10
10:10:07.000000|tcp|10.20.9.40|37393|10.20.6.40|9100|S|3375567612|29200|0|
10:10:07.000995|tcp|10.20.6.40|9100|10.20.9.40|37393|S.|1800002124|64240|0|
10:10:07.002188|tcp|10.20.9.40|37393|10.20.6.40|9100|.|3375567613|29200|0|
10:10:07.053272|tcp|10.20.9.40|37393|10.20.6.40|9100|P.|3375567613|29200|700|GET /metrics HTTP/1.1
10:10:07.057864|tcp|10.20.6.40|9100|10.20.9.40|37393|P.|1800002125|64240|1379|
10:10:07.058164|tcp|10.20.9.40|37393|10.20.6.40|9100|.|3375568313|29200|0|
10:10:07.078164|tcp|10.20.9.40|37393|10.20.6.40|9100|F.|3375568313|29200|0|
10:10:07.078664|tcp|10.20.6.40|9100|10.20.9.40|37393|F.|1800003504|64240|0|
10:10:07.078864|tcp|10.20.9.40|37393|10.20.6.40|9100|.|3375568314|29200|0|
10:10:19.039755|udp|10.20.6.40|38676|10.20.1.10|53|q|44272|0|44|44272+ A? www.example.com.
10:10:19.043491|udp|10.20.1.10|53|10.20.6.40|38676|r|44272|0|60|44272 1/0/0 A 192.0.2.10
10:10:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 6
10:10:31.000393|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 6
10:11:07.000000|tcp|10.20.9.40|57794|10.20.6.40|9100|S|2146701200|65535|0|
10:11:07.000418|tcp|10.20.6.40|9100|10.20.9.40|57794|S.|2515633440|64240|0|
10:11:07.001441|tcp|10.20.9.40|57794|10.20.6.40|9100|.|2146701201|65535|0|
10:11:07.053593|tcp|10.20.9.40|57794|10.20.6.40|9100|P.|2146701201|65535|854|GET /metrics HTTP/1.1
10:11:07.056937|tcp|10.20.6.40|9100|10.20.9.40|57794|P.|2515633441|64240|1521|
10:11:07.057237|tcp|10.20.9.40|57794|10.20.6.40|9100|.|2146702055|65535|0|
10:11:07.077237|tcp|10.20.9.40|57794|10.20.6.40|9100|F.|2146702055|65535|0|
10:11:07.077737|tcp|10.20.6.40|9100|10.20.9.40|57794|F.|2515634962|64240|0|
10:11:07.077937|tcp|10.20.9.40|57794|10.20.6.40|9100|.|2146702056|65535|0|
10:11:08.357270|udp|10.20.6.40|58755|10.20.1.10|53|q|55756|0|44|55756+ A? www.example.com.
10:11:08.360482|udp|10.20.1.10|53|10.20.6.40|58755|r|55756|0|60|55756 1/0/0 A 192.0.2.10
10:11:45.520974|udp|10.20.6.40|50762|10.20.1.10|53|q|18146|0|44|18146+ A? www.example.com.
10:11:45.524718|udp|10.20.1.10|53|10.20.6.40|50762|r|18146|0|60|18146 1/0/0 A 192.0.2.10
10:12:07.000000|tcp|10.20.9.40|54843|10.20.6.40|9100|S|3618131872|62720|0|
10:12:07.001275|tcp|10.20.6.40|9100|10.20.9.40|54843|S.|3938200780|29200|0|
10:12:07.002005|tcp|10.20.9.40|54843|10.20.6.40|9100|.|3618131873|62720|0|
10:12:07.019533|tcp|10.20.9.40|54843|10.20.6.40|9100|P.|3618131873|62720|870|GET /metrics HTTP/1.1
10:12:07.021374|tcp|10.20.6.40|9100|10.20.9.40|54843|P.|3938200781|29200|1259|
10:12:07.021674|tcp|10.20.9.40|54843|10.20.6.40|9100|.|3618132743|62720|0|
10:12:07.041674|tcp|10.20.9.40|54843|10.20.6.40|9100|F.|3618132743|62720|0|
10:12:07.042174|tcp|10.20.6.40|9100|10.20.9.40|54843|F.|3938202040|29200|0|
10:12:07.042374|tcp|10.20.9.40|54843|10.20.6.40|9100|.|3618132744|62720|0|
10:12:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 7
10:12:31.000612|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 7
10:12:40.442323|tcp|10.20.4.31|57084|10.20.6.40|443|S|1197348860|65535|0|
10:12:40.443613|tcp|10.20.6.40|443|10.20.4.31|57084|S.|2250100570|64240|0|
10:12:40.444548|tcp|10.20.4.31|57084|10.20.6.40|443|.|1197348861|65535|0|
10:12:40.492279|tcp|10.20.4.31|57084|10.20.6.40|443|P.|1197348861|65535|859|TLS SNI: portal.ridgelinemed.example
10:12:40.495612|tcp|10.20.6.40|443|10.20.4.31|57084|P.|2250100571|64240|880|
10:12:40.495912|tcp|10.20.4.31|57084|10.20.6.40|443|.|1197349720|65535|0|
10:12:40.545545|tcp|10.20.4.31|57084|10.20.6.40|443|P.|1197349720|65535|1305|
10:12:40.548694|tcp|10.20.6.40|443|10.20.4.31|57084|P.|2250101451|64240|894|
10:12:40.548994|tcp|10.20.4.31|57084|10.20.6.40|443|.|1197351025|65535|0|
10:12:40.574498|tcp|10.20.4.31|57084|10.20.6.40|443|P.|1197351025|65535|811|
10:12:40.578014|tcp|10.20.6.40|443|10.20.4.31|57084|P.|2250102345|64240|2195|
10:12:40.578314|tcp|10.20.4.31|57084|10.20.6.40|443|.|1197351836|65535|0|
10:12:40.605895|tcp|10.20.4.31|57084|10.20.6.40|443|P.|1197351836|65535|777|
10:12:40.611186|tcp|10.20.6.40|443|10.20.4.31|57084|P.|2250104540|64240|1537|
10:12:40.611486|tcp|10.20.4.31|57084|10.20.6.40|443|.|1197352613|65535|0|
10:12:40.653642|tcp|10.20.4.31|57084|10.20.6.40|443|P.|1197352613|65535|815|
10:12:40.658064|tcp|10.20.6.40|443|10.20.4.31|57084|P.|2250106077|64240|807|
10:12:40.658364|tcp|10.20.4.31|57084|10.20.6.40|443|.|1197353428|65535|0|
10:12:40.706841|tcp|10.20.4.31|57084|10.20.6.40|443|P.|1197353428|65535|889|
10:12:40.711098|tcp|10.20.6.40|443|10.20.4.31|57084|P.|2250106884|64240|2729|
10:12:40.711398|tcp|10.20.4.31|57084|10.20.6.40|443|.|1197354317|65535|0|
10:12:40.741163|tcp|10.20.4.31|57084|10.20.6.40|443|P.|1197354317|65535|1360|
10:12:40.742344|tcp|10.20.6.40|443|10.20.4.31|57084|P.|2250109613|64240|1267|
10:12:40.742644|tcp|10.20.4.31|57084|10.20.6.40|443|.|1197355677|65535|0|
10:12:40.788429|tcp|10.20.4.31|57084|10.20.6.40|443|P.|1197355677|65535|1386|
10:12:40.792975|tcp|10.20.6.40|443|10.20.4.31|57084|P.|2250110880|64240|1278|
10:12:40.793275|tcp|10.20.4.31|57084|10.20.6.40|443|.|1197357063|65535|0|
10:12:40.817476|tcp|10.20.4.31|57084|10.20.6.40|443|P.|1197357063|65535|1334|
10:12:40.820266|tcp|10.20.6.40|443|10.20.4.31|57084|P.|2250112158|64240|2080|
10:12:40.820566|tcp|10.20.4.31|57084|10.20.6.40|443|.|1197358397|65535|0|
10:12:40.840566|tcp|10.20.4.31|57084|10.20.6.40|443|F.|1197358397|65535|0|
10:12:40.841066|tcp|10.20.6.40|443|10.20.4.31|57084|F.|2250114238|64240|0|
10:12:40.841266|tcp|10.20.4.31|57084|10.20.6.40|443|.|1197358398|65535|0|
10:12:55.204238|udp|10.20.6.40|49992|10.20.1.10|53|q|37482|0|56|37482+ A? portal.ridgelinemed.example.
10:12:55.207840|udp|10.20.1.10|53|10.20.6.40|49992|r|37482|0|72|37482 1/0/0 A 10.20.6.40
10:13:07.000000|tcp|10.20.9.40|38680|10.20.6.40|9100|S|71144402|62720|0|
10:13:07.000474|tcp|10.20.6.40|9100|10.20.9.40|38680|S.|1799118606|65535|0|
10:13:07.001598|tcp|10.20.9.40|38680|10.20.6.40|9100|.|71144403|62720|0|
10:13:07.027947|tcp|10.20.9.40|38680|10.20.6.40|9100|P.|71144403|62720|688|GET /metrics HTTP/1.1
10:13:07.032405|tcp|10.20.6.40|9100|10.20.9.40|38680|P.|1799118607|65535|1149|
10:13:07.032705|tcp|10.20.9.40|38680|10.20.6.40|9100|.|71145091|62720|0|
10:13:07.052705|tcp|10.20.9.40|38680|10.20.6.40|9100|F.|71145091|62720|0|
10:13:07.053205|tcp|10.20.6.40|9100|10.20.9.40|38680|F.|1799119756|65535|0|
10:13:07.053405|tcp|10.20.9.40|38680|10.20.6.40|9100|.|71145092|62720|0|
10:13:52.213162|udp|10.20.6.40|48991|10.20.1.10|53|q|32962|0|40|32962+ A? example.com.
10:13:52.215886|udp|10.20.1.10|53|10.20.6.40|48991|r|32962|0|56|32962 1/0/0 A 192.0.2.10
10:14:07.000000|tcp|10.20.9.40|34448|10.20.6.40|9100|S|1913377246|29200|0|
10:14:07.000566|tcp|10.20.6.40|9100|10.20.9.40|34448|S.|1074193828|65535|0|
10:14:07.001164|tcp|10.20.9.40|34448|10.20.6.40|9100|.|1913377247|29200|0|
10:14:07.045228|tcp|10.20.9.40|34448|10.20.6.40|9100|P.|1913377247|29200|880|GET /metrics HTTP/1.1
10:14:07.048933|tcp|10.20.6.40|9100|10.20.9.40|34448|P.|1074193829|65535|525|
10:14:07.049233|tcp|10.20.9.40|34448|10.20.6.40|9100|.|1913378127|29200|0|
10:14:07.069233|tcp|10.20.9.40|34448|10.20.6.40|9100|F.|1913378127|29200|0|
10:14:07.069733|tcp|10.20.6.40|9100|10.20.9.40|34448|F.|1074194354|65535|0|
10:14:07.069933|tcp|10.20.9.40|34448|10.20.6.40|9100|.|1913378128|29200|0|
10:14:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 8
10:14:31.000718|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 8
10:14:58.825102|udp|10.20.6.40|36840|10.20.1.10|53|q|8471|0|56|8471+ A? portal.ridgelinemed.example.
10:14:58.828972|udp|10.20.1.10|53|10.20.6.40|36840|r|8471|0|72|8471 1/0/0 A 10.20.6.40
10:15:04.000000|tcp|10.20.9.15|36380|10.20.6.40|22|S|3669124069|64240|0|
10:15:04.001254|tcp|10.20.6.40|22|10.20.9.15|36380|S.|2285681305|64240|0|
10:15:04.002105|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669124070|64240|0|
10:15:04.032145|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669124070|64240|3579|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:15:04.033771|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285681306|64240|3026|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:15:04.034071|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669127649|64240|0|
10:15:04.077858|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669127649|64240|2041|
10:15:04.080156|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285684332|64240|4483|
10:15:04.080456|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669129690|64240|0|
10:15:04.105221|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669129690|64240|2149|
10:15:04.111123|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285688815|64240|4922|
10:15:04.111423|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669131839|64240|0|
10:15:04.130249|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669131839|64240|2213|
10:15:04.132765|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285693737|64240|6064|
10:15:04.133065|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669134052|64240|0|
10:15:04.178813|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669134052|64240|3734|
10:15:04.181203|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285699801|64240|2775|
10:15:04.181503|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669137786|64240|0|
10:15:04.202183|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669137786|64240|3980|
10:15:04.207910|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285702576|64240|5599|
10:15:04.208210|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669141766|64240|0|
10:15:04.235524|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669141766|64240|3407|
10:15:04.240717|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285708175|64240|7662|
10:15:04.241017|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669145173|64240|0|
10:15:04.276753|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669145173|64240|2855|
10:15:04.279022|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285715837|64240|2288|
10:15:04.279322|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669148028|64240|0|
10:15:04.301658|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669148028|64240|3791|
10:15:04.306494|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285718125|64240|3379|
10:15:04.306794|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669151819|64240|0|
10:15:04.317384|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669151819|64240|3034|
10:15:04.321749|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285721504|64240|6506|
10:15:04.322049|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669154853|64240|0|
10:15:04.360589|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669154853|64240|2274|
10:15:04.365391|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285728010|64240|7777|
10:15:04.365691|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669157127|64240|0|
10:15:04.378619|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669157127|64240|2518|
10:15:04.382602|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285735787|64240|4878|
10:15:04.382902|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669159645|64240|0|
10:15:04.402746|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669159645|64240|3091|
10:15:04.403776|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285740665|64240|5776|
10:15:04.404076|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669162736|64240|0|
10:15:04.452251|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669162736|64240|2071|
10:15:04.457915|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285746441|64240|2412|
10:15:04.458215|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669164807|64240|0|
10:15:04.498662|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669164807|64240|2422|
10:15:04.502508|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285748853|64240|3154|
10:15:04.502808|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669167229|64240|0|
10:15:04.540093|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669167229|64240|3886|
10:15:04.542910|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285752007|64240|7714|
10:15:04.543210|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669171115|64240|0|
10:15:04.572714|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669171115|64240|3023|
10:15:04.575957|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285759721|64240|6732|
10:15:04.576257|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669174138|64240|0|
10:15:04.600578|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669174138|64240|2835|
10:15:04.606552|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285766453|64240|4477|
10:15:04.606852|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669176973|64240|0|
10:15:04.657603|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669176973|64240|2607|
10:15:04.658995|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285770930|64240|4800|
10:15:04.659295|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669179580|64240|0|
10:15:04.716409|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669179580|64240|2554|
10:15:04.720008|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285775730|64240|5971|
10:15:04.720308|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669182134|64240|0|
10:15:04.745466|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669182134|64240|3906|
10:15:04.747681|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285781701|64240|5470|
10:15:04.747981|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669186040|64240|0|
10:15:04.777791|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669186040|64240|3693|
10:15:04.783102|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285787171|64240|3372|
10:15:04.783402|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669189733|64240|0|
10:15:04.836668|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669189733|64240|2491|
10:15:04.838196|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285790543|64240|7072|
10:15:04.838496|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669192224|64240|0|
10:15:04.891014|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669192224|64240|3757|
10:15:04.893431|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285797615|64240|7685|
10:15:04.893731|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669195981|64240|0|
10:15:04.950233|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669195981|64240|2597|
10:15:04.955068|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285805300|64240|2485|
10:15:04.955368|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669198578|64240|0|
10:15:04.979505|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669198578|64240|3221|
10:15:04.983115|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285807785|64240|6675|
10:15:04.983415|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669201799|64240|0|
10:15:05.028473|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669201799|64240|2797|
10:15:05.033229|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285814460|64240|3519|
10:15:05.033529|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669204596|64240|0|
10:15:05.048196|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669204596|64240|2460|
10:15:05.053303|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285817979|64240|6578|
10:15:05.053603|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669207056|64240|0|
10:15:05.079933|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669207056|64240|3105|
10:15:05.083353|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285824557|64240|5242|
10:15:05.083653|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669210161|64240|0|
10:15:05.110016|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669210161|64240|2681|
10:15:05.112230|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285829799|64240|2424|
10:15:05.112530|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669212842|64240|0|
10:15:05.139709|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669212842|64240|2834|
10:15:05.144909|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285832223|64240|2777|
10:15:05.145209|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669215676|64240|0|
10:15:05.166302|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669215676|64240|3798|
10:15:05.171434|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285835000|64240|6332|
10:15:05.171734|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669219474|64240|0|
10:15:05.202267|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669219474|64240|3307|
10:15:05.207086|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285841332|64240|4252|
10:15:05.207386|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669222781|64240|0|
10:15:05.257562|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669222781|64240|3435|
10:15:05.259075|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285845584|64240|4092|
10:15:05.259375|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669226216|64240|0|
10:15:05.284648|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669226216|64240|2732|
10:15:05.287924|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285849676|64240|4851|
10:15:05.288224|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669228948|64240|0|
10:15:05.329208|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669228948|64240|3256|
10:15:05.330890|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285854527|64240|2281|
10:15:05.331190|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669232204|64240|0|
10:15:05.379578|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669232204|64240|2395|
10:15:05.381362|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285856808|64240|6948|
10:15:05.381662|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669234599|64240|0|
10:15:05.416788|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669234599|64240|2068|
10:15:05.421982|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285863756|64240|5669|
10:15:05.422282|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669236667|64240|0|
10:15:05.439222|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669236667|64240|2167|
10:15:05.440584|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285869425|64240|3150|
10:15:05.440884|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669238834|64240|0|
10:15:05.466992|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669238834|64240|3993|
10:15:05.472792|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285872575|64240|4105|
10:15:05.473092|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669242827|64240|0|
10:15:05.513838|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669242827|64240|2326|
10:15:05.515909|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285876680|64240|4489|
10:15:05.516209|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669245153|64240|0|
10:15:05.539919|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669245153|64240|3998|
10:15:05.542127|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285881169|64240|3294|
10:15:05.542427|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669249151|64240|0|
10:15:05.568704|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669249151|64240|3798|
10:15:05.573908|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285884463|64240|7518|
10:15:05.574208|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669252949|64240|0|
10:15:05.587586|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669252949|64240|2738|
10:15:05.589252|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285891981|64240|2928|
10:15:05.589552|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669255687|64240|0|
10:15:05.637269|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669255687|64240|3153|
10:15:05.639799|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285894909|64240|4810|
10:15:05.640099|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669258840|64240|0|
10:15:05.687274|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669258840|64240|3481|
10:15:05.692335|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285899719|64240|3778|
10:15:05.692635|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669262321|64240|0|
10:15:05.723200|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669262321|64240|3036|
10:15:05.726403|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285903497|64240|3811|
10:15:05.726703|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669265357|64240|0|
10:15:05.754997|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669265357|64240|2440|
10:15:05.759559|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285907308|64240|3618|
10:15:05.759859|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669267797|64240|0|
10:15:05.788115|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669267797|64240|3619|
10:15:05.791352|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285910926|64240|6182|
10:15:05.791652|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669271416|64240|0|
10:15:05.843626|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669271416|64240|3152|
10:15:05.845296|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285917108|64240|7273|
10:15:05.845596|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669274568|64240|0|
10:15:05.865165|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669274568|64240|3993|
10:15:05.867779|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285924381|64240|3818|
10:15:05.868079|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669278561|64240|0|
10:15:05.894826|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669278561|64240|2477|
10:15:05.899044|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285928199|64240|4699|
10:15:05.899344|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669281038|64240|0|
10:15:05.930922|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669281038|64240|2158|
10:15:05.935530|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285932898|64240|2905|
10:15:05.935830|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669283196|64240|0|
10:15:05.946174|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669283196|64240|3049|
10:15:05.947926|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285935803|64240|4613|
10:15:05.948226|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669286245|64240|0|
10:15:05.967787|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669286245|64240|3040|
10:15:05.971270|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285940416|64240|7474|
10:15:05.971570|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669289285|64240|0|
10:15:05.994979|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669289285|64240|3114|
10:15:05.999927|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285947890|64240|4584|
10:15:06.000227|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669292399|64240|0|
10:15:06.051098|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669292399|64240|2350|
10:15:06.055465|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285952474|64240|5613|
10:15:06.055765|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669294749|64240|0|
10:15:06.066412|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669294749|64240|3417|
10:15:06.069077|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285958087|64240|3434|
10:15:06.069377|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669298166|64240|0|
10:15:06.124744|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669298166|64240|3275|
10:15:06.129719|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285961521|64240|7819|
10:15:06.130019|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669301441|64240|0|
10:15:06.181899|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669301441|64240|2663|
10:15:06.186387|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285969340|64240|3459|
10:15:06.186687|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669304104|64240|0|
10:15:06.235227|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669304104|64240|3306|
10:15:06.238461|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285972799|64240|3035|
10:15:06.238761|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669307410|64240|0|
10:15:06.284960|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669307410|64240|2400|
10:15:06.289375|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285975834|64240|2854|
10:15:06.289675|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669309810|64240|0|
10:15:06.331248|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669309810|64240|3732|
10:15:06.337186|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285978688|64240|2992|
10:15:06.337486|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669313542|64240|0|
10:15:06.385524|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669313542|64240|2257|
10:15:06.387593|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285981680|64240|6092|
10:15:06.387893|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669315799|64240|0|
10:15:06.403430|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669315799|64240|3612|
10:15:06.404780|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285987772|64240|7996|
10:15:06.405080|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669319411|64240|0|
10:15:06.441845|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669319411|64240|2048|
10:15:06.444850|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2285995768|64240|5814|
10:15:06.445150|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669321459|64240|0|
10:15:06.497924|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669321459|64240|3726|
10:15:06.500533|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286001582|64240|2876|
10:15:06.500833|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669325185|64240|0|
10:15:06.524906|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669325185|64240|2023|
10:15:06.528414|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286004458|64240|5183|
10:15:06.528714|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669327208|64240|0|
10:15:06.553402|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669327208|64240|2358|
10:15:06.557062|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286009641|64240|6568|
10:15:06.557362|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669329566|64240|0|
10:15:06.571191|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669329566|64240|3413|
10:15:06.575626|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286016209|64240|3162|
10:15:06.575926|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669332979|64240|0|
10:15:06.596967|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669332979|64240|2134|
10:15:06.599626|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286019371|64240|6470|
10:15:06.599926|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669335113|64240|0|
10:15:06.611897|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669335113|64240|3815|
10:15:06.616750|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286025841|64240|5650|
10:15:06.617050|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669338928|64240|0|
10:15:06.670961|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669338928|64240|2040|
10:15:06.675496|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286031491|64240|6143|
10:15:06.675796|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669340968|64240|0|
10:15:06.707827|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669340968|64240|2458|
10:15:06.711590|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286037634|64240|5340|
10:15:06.711890|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669343426|64240|0|
10:15:06.769842|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669343426|64240|3717|
10:15:06.771469|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286042974|64240|2734|
10:15:06.771769|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669347143|64240|0|
10:15:06.831172|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669347143|64240|2285|
10:15:06.833374|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286045708|64240|6684|
10:15:06.833674|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669349428|64240|0|
10:15:06.849698|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669349428|64240|3706|
10:15:06.853904|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286052392|64240|3107|
10:15:06.854204|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669353134|64240|0|
10:15:06.864388|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669353134|64240|2644|
10:15:06.869305|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286055499|64240|3214|
10:15:06.869605|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669355778|64240|0|
10:15:06.911726|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669355778|64240|3465|
10:15:06.917503|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286058713|64240|7988|
10:15:06.917803|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669359243|64240|0|
10:15:06.968816|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669359243|64240|2551|
10:15:06.973646|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286066701|64240|7073|
10:15:06.973946|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669361794|64240|0|
10:15:07.000000|tcp|10.20.9.40|53129|10.20.6.40|9100|S|1552286469|29200|0|
10:15:07.001107|tcp|10.20.6.40|9100|10.20.9.40|53129|S.|937586468|62720|0|
10:15:07.002120|tcp|10.20.9.40|53129|10.20.6.40|9100|.|1552286470|29200|0|
10:15:07.003924|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669361794|64240|2282|
10:15:07.008877|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286073774|64240|2474|
10:15:07.009177|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669364076|64240|0|
10:15:07.020931|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669364076|64240|3255|
10:15:07.023991|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286076248|64240|5628|
10:15:07.024291|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669367331|64240|0|
10:15:07.037190|tcp|10.20.9.40|53129|10.20.6.40|9100|P.|1552286470|29200|882|GET /metrics HTTP/1.1
10:15:07.039294|tcp|10.20.6.40|9100|10.20.9.40|53129|P.|937586469|62720|1348|
10:15:07.039594|tcp|10.20.9.40|53129|10.20.6.40|9100|.|1552287352|29200|0|
10:15:07.059594|tcp|10.20.9.40|53129|10.20.6.40|9100|F.|1552287352|29200|0|
10:15:07.060094|tcp|10.20.6.40|9100|10.20.9.40|53129|F.|937587817|62720|0|
10:15:07.060294|tcp|10.20.9.40|53129|10.20.6.40|9100|.|1552287353|29200|0|
10:15:07.069345|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669367331|64240|2954|
10:15:07.071024|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286081876|64240|4553|
10:15:07.071324|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669370285|64240|0|
10:15:07.119418|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669370285|64240|3457|
10:15:07.122521|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286086429|64240|2962|
10:15:07.122821|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669373742|64240|0|
10:15:07.155979|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669373742|64240|3948|
10:15:07.159447|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286089391|64240|5111|
10:15:07.159747|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669377690|64240|0|
10:15:07.182223|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669377690|64240|2993|
10:15:07.184472|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286094502|64240|4361|
10:15:07.184772|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669380683|64240|0|
10:15:07.218116|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669380683|64240|3922|
10:15:07.222552|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286098863|64240|7182|
10:15:07.222852|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669384605|64240|0|
10:15:07.233544|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669384605|64240|3560|
10:15:07.237874|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286106045|64240|5536|
10:15:07.238174|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669388165|64240|0|
10:15:07.256290|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669388165|64240|3333|
10:15:07.260980|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286111581|64240|6015|
10:15:07.261280|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669391498|64240|0|
10:15:07.311983|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669391498|64240|3503|
10:15:07.317589|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286117596|64240|7743|
10:15:07.317889|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669395001|64240|0|
10:15:07.355437|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669395001|64240|3682|
10:15:07.359325|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286125339|64240|5187|
10:15:07.359625|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669398683|64240|0|
10:15:07.416703|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669398683|64240|3113|
10:15:07.420852|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286130526|64240|3739|
10:15:07.421152|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669401796|64240|0|
10:15:07.472977|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669401796|64240|3965|
10:15:07.474751|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286134265|64240|4033|
10:15:07.475051|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669405761|64240|0|
10:15:07.485647|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669405761|64240|3656|
10:15:07.489023|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286138298|64240|3198|
10:15:07.489323|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669409417|64240|0|
10:15:07.501676|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669409417|64240|2700|
10:15:07.503495|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286141496|64240|5133|
10:15:07.503795|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669412117|64240|0|
10:15:07.527664|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669412117|64240|3820|
10:15:07.529093|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286146629|64240|6685|
10:15:07.529393|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669415937|64240|0|
10:15:07.581294|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669415937|64240|2949|
10:15:07.582819|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286153314|64240|6520|
10:15:07.583119|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669418886|64240|0|
10:15:07.615689|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669418886|64240|3666|
10:15:07.618230|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286159834|64240|2921|
10:15:07.618530|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669422552|64240|0|
10:15:07.656470|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669422552|64240|2072|
10:15:07.657596|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286162755|64240|6527|
10:15:07.657896|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669424624|64240|0|
10:15:07.689229|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669424624|64240|2819|
10:15:07.691028|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286169282|64240|7239|
10:15:07.691328|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669427443|64240|0|
10:15:07.714151|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669427443|64240|2485|
10:15:07.718691|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286176521|64240|7272|
10:15:07.718991|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669429928|64240|0|
10:15:07.773750|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669429928|64240|2423|
10:15:07.775461|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286183793|64240|4987|
10:15:07.775761|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669432351|64240|0|
10:15:07.786751|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669432351|64240|3435|
10:15:07.787871|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286188780|64240|4597|
10:15:07.788171|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669435786|64240|0|
10:15:07.808598|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669435786|64240|3388|
10:15:07.814059|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286193377|64240|3070|
10:15:07.814359|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669439174|64240|0|
10:15:07.851281|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669439174|64240|3774|
10:15:07.853625|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286196447|64240|5724|
10:15:07.853925|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669442948|64240|0|
10:15:07.864179|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669442948|64240|3021|
10:15:07.870047|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286202171|64240|5515|
10:15:07.870347|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669445969|64240|0|
10:15:07.907896|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669445969|64240|3315|
10:15:07.913717|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286207686|64240|4015|
10:15:07.914017|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669449284|64240|0|
10:15:07.942532|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669449284|64240|3345|
10:15:07.945984|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286211701|64240|5141|
10:15:07.946284|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669452629|64240|0|
10:15:07.983160|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669452629|64240|3245|
10:15:07.988952|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286216842|64240|2756|
10:15:07.989252|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669455874|64240|0|
10:15:08.010439|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669455874|64240|2030|
10:15:08.012894|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286219598|64240|7361|
10:15:08.013194|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669457904|64240|0|
10:15:08.027713|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669457904|64240|3887|
10:15:08.033300|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286226959|64240|6965|
10:15:08.033600|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669461791|64240|0|
10:15:08.080221|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669461791|64240|2564|
10:15:08.083869|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286233924|64240|6029|
10:15:08.084169|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669464355|64240|0|
10:15:08.116149|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669464355|64240|3919|
10:15:08.118686|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286239953|64240|5203|
10:15:08.118986|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669468274|64240|0|
10:15:08.165192|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669468274|64240|3673|
10:15:08.167132|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286245156|64240|2158|
10:15:08.167432|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669471947|64240|0|
10:15:08.208259|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669471947|64240|2692|
10:15:08.211255|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286247314|64240|2273|
10:15:08.211555|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669474639|64240|0|
10:15:08.256196|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669474639|64240|3760|
10:15:08.261334|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286249587|64240|2174|
10:15:08.261634|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669478399|64240|0|
10:15:08.292842|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669478399|64240|2408|
10:15:08.297651|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286251761|64240|3300|
10:15:08.297951|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669480807|64240|0|
10:15:08.317748|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669480807|64240|2071|
10:15:08.322268|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286255061|64240|5514|
10:15:08.322568|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669482878|64240|0|
10:15:08.337235|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669482878|64240|3742|
10:15:08.341893|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286260575|64240|2051|
10:15:08.342193|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669486620|64240|0|
10:15:08.365554|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669486620|64240|2171|
10:15:08.370046|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286262626|64240|6313|
10:15:08.370346|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669488791|64240|0|
10:15:08.407728|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669488791|64240|2117|
10:15:08.413075|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286268939|64240|4789|
10:15:08.413375|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669490908|64240|0|
10:15:08.457370|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669490908|64240|3646|
10:15:08.460129|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286273728|64240|7182|
10:15:08.460429|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669494554|64240|0|
10:15:08.498548|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669494554|64240|3141|
10:15:08.503004|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286280910|64240|5845|
10:15:08.503304|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669497695|64240|0|
10:15:08.514755|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669497695|64240|3942|
10:15:08.520094|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286286755|64240|5576|
10:15:08.520394|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669501637|64240|0|
10:15:08.550286|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669501637|64240|3884|
10:15:08.554759|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286292331|64240|4218|
10:15:08.555059|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669505521|64240|0|
10:15:08.595567|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669505521|64240|2774|
10:15:08.600269|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286296549|64240|5278|
10:15:08.600569|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669508295|64240|0|
10:15:08.654341|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669508295|64240|2372|
10:15:08.657448|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286301827|64240|5588|
10:15:08.657748|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669510667|64240|0|
10:15:08.717474|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669510667|64240|2041|
10:15:08.722922|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286307415|64240|6525|
10:15:08.723222|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669512708|64240|0|
10:15:08.744805|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669512708|64240|3944|
10:15:08.745965|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286313940|64240|7418|
10:15:08.746265|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669516652|64240|0|
10:15:08.782402|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669516652|64240|3465|
10:15:08.787162|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286321358|64240|3517|
10:15:08.787462|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669520117|64240|0|
10:15:08.823402|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669520117|64240|2113|
10:15:08.826639|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286324875|64240|2194|
10:15:08.826939|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669522230|64240|0|
10:15:08.871525|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669522230|64240|3118|
10:15:08.875730|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286327069|64240|5457|
10:15:08.876030|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669525348|64240|0|
10:15:08.894638|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669525348|64240|2418|
10:15:08.895685|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286332526|64240|5979|
10:15:08.895985|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669527766|64240|0|
10:15:08.941073|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669527766|64240|3197|
10:15:08.946589|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286338505|64240|2158|
10:15:08.946889|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669530963|64240|0|
10:15:08.962239|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669530963|64240|3491|
10:15:08.963864|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286340663|64240|7650|
10:15:08.964164|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669534454|64240|0|
10:15:09.004036|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669534454|64240|3837|
10:15:09.007592|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286348313|64240|3776|
10:15:09.007892|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669538291|64240|0|
10:15:09.061267|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669538291|64240|2999|
10:15:09.065124|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286352089|64240|2104|
10:15:09.065424|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669541290|64240|0|
10:15:09.075545|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669541290|64240|3811|
10:15:09.077201|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286354193|64240|6345|
10:15:09.077501|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669545101|64240|0|
10:15:09.097476|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669545101|64240|3055|
10:15:09.099442|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286360538|64240|7326|
10:15:09.099742|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669548156|64240|0|
10:15:09.137551|tcp|10.20.9.15|36380|10.20.6.40|22|P.|3669548156|64240|2629|
10:15:09.142464|tcp|10.20.6.40|22|10.20.9.15|36380|P.|2286367864|64240|2290|
10:15:09.142764|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669550785|64240|0|
10:15:09.162764|tcp|10.20.9.15|36380|10.20.6.40|22|F.|3669550785|64240|0|
10:15:09.163264|tcp|10.20.6.40|22|10.20.9.15|36380|F.|2286370154|64240|0|
10:15:09.163464|tcp|10.20.9.15|36380|10.20.6.40|22|.|3669550786|64240|0|
10:15:33.768978|udp|10.20.6.40|40382|10.20.1.10|53|q|21851|0|63|21851+ A? rmg-backup-01.ridgelinemed.example.
10:15:33.772560|udp|10.20.1.10|53|10.20.6.40|40382|r|21851|0|79|21851 1/0/0 A 10.20.9.15
10:16:07.000000|tcp|10.20.9.40|41101|10.20.6.40|9100|S|1798843834|29200|0|
10:16:07.001246|tcp|10.20.6.40|9100|10.20.9.40|41101|S.|2204400917|62720|0|
10:16:07.002398|tcp|10.20.9.40|41101|10.20.6.40|9100|.|1798843835|29200|0|
10:16:07.035683|tcp|10.20.9.40|41101|10.20.6.40|9100|P.|1798843835|29200|457|GET /metrics HTTP/1.1
10:16:07.038966|tcp|10.20.6.40|9100|10.20.9.40|41101|P.|2204400918|62720|1292|
10:16:07.039266|tcp|10.20.9.40|41101|10.20.6.40|9100|.|1798844292|29200|0|
10:16:07.059266|tcp|10.20.9.40|41101|10.20.6.40|9100|F.|1798844292|29200|0|
10:16:07.059766|tcp|10.20.6.40|9100|10.20.9.40|41101|F.|2204402210|62720|0|
10:16:07.059966|tcp|10.20.9.40|41101|10.20.6.40|9100|.|1798844293|29200|0|
10:16:26.214683|udp|10.20.6.40|58583|10.20.1.10|53|q|31091|0|63|31091+ A? rmg-backup-01.ridgelinemed.example.
10:16:26.217362|udp|10.20.1.10|53|10.20.6.40|58583|r|31091|0|79|31091 1/0/0 A 10.20.9.15
10:16:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 9
10:16:31.000784|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 9
10:17:00.225392|tcp|10.20.6.40|40767|192.0.2.30|443|S|3178298007|62720|0|
10:17:00.226310|tcp|192.0.2.30|443|10.20.6.40|40767|S.|792380553|65535|0|
10:17:00.226999|tcp|10.20.6.40|40767|192.0.2.30|443|.|3178298008|62720|0|
10:17:00.276120|tcp|10.20.6.40|40767|192.0.2.30|443|P.|3178298008|62720|914|TLS SNI: packages.example.org
10:17:00.281940|tcp|192.0.2.30|443|10.20.6.40|40767|P.|792380554|65535|2385|
10:17:00.282240|tcp|10.20.6.40|40767|192.0.2.30|443|.|3178298922|62720|0|
10:17:00.327671|tcp|10.20.6.40|40767|192.0.2.30|443|P.|3178298922|62720|634|
10:17:00.329082|tcp|192.0.2.30|443|10.20.6.40|40767|P.|792382939|65535|1929|
10:17:00.329382|tcp|10.20.6.40|40767|192.0.2.30|443|.|3178299556|62720|0|
10:17:00.387083|tcp|10.20.6.40|40767|192.0.2.30|443|P.|3178299556|62720|966|
10:17:00.390170|tcp|192.0.2.30|443|10.20.6.40|40767|P.|792384868|65535|1437|
10:17:00.390470|tcp|10.20.6.40|40767|192.0.2.30|443|.|3178300522|62720|0|
10:17:00.423273|tcp|10.20.6.40|40767|192.0.2.30|443|P.|3178300522|62720|1077|
10:17:00.427865|tcp|192.0.2.30|443|10.20.6.40|40767|P.|792386305|65535|1118|
10:17:00.428165|tcp|10.20.6.40|40767|192.0.2.30|443|.|3178301599|62720|0|
10:17:00.448165|tcp|10.20.6.40|40767|192.0.2.30|443|F.|3178301599|62720|0|
10:17:00.448665|tcp|192.0.2.30|443|10.20.6.40|40767|F.|792387423|65535|0|
10:17:00.448865|tcp|10.20.6.40|40767|192.0.2.30|443|.|3178301600|62720|0|
10:17:07.000000|tcp|10.20.9.40|60354|10.20.6.40|9100|S|3562172207|64240|0|
10:17:07.000785|tcp|10.20.6.40|9100|10.20.9.40|60354|S.|2915708429|64240|0|
10:17:07.001461|tcp|10.20.9.40|60354|10.20.6.40|9100|.|3562172208|64240|0|
10:17:07.058658|tcp|10.20.9.40|60354|10.20.6.40|9100|P.|3562172208|64240|570|GET /metrics HTTP/1.1
10:17:07.060912|tcp|10.20.6.40|9100|10.20.9.40|60354|P.|2915708430|64240|549|
10:17:07.061212|tcp|10.20.9.40|60354|10.20.6.40|9100|.|3562172778|64240|0|
10:17:07.081212|tcp|10.20.9.40|60354|10.20.6.40|9100|F.|3562172778|64240|0|
10:17:07.081712|tcp|10.20.6.40|9100|10.20.9.40|60354|F.|2915708979|64240|0|
10:17:07.081912|tcp|10.20.9.40|60354|10.20.6.40|9100|.|3562172779|64240|0|
10:17:09.752032|udp|10.20.6.40|47294|10.20.1.10|53|q|5773|0|63|5773+ A? rmg-backup-01.ridgelinemed.example.
10:17:09.754721|udp|10.20.1.10|53|10.20.6.40|47294|r|5773|0|79|5773 1/0/0 A 10.20.9.15
10:17:55.061434|udp|10.20.6.40|46479|10.20.1.10|53|q|50878|0|40|50878+ A? example.com.
10:17:55.063720|udp|10.20.1.10|53|10.20.6.40|46479|r|50878|0|56|50878 1/0/0 A 192.0.2.10
10:18:07.000000|tcp|10.20.9.40|58301|10.20.6.40|9100|S|286555019|64240|0|
10:18:07.001214|tcp|10.20.6.40|9100|10.20.9.40|58301|S.|1069843049|62720|0|
10:18:07.002147|tcp|10.20.9.40|58301|10.20.6.40|9100|.|286555020|64240|0|
10:18:07.056324|tcp|10.20.9.40|58301|10.20.6.40|9100|P.|286555020|64240|638|GET /metrics HTTP/1.1
10:18:07.061014|tcp|10.20.6.40|9100|10.20.9.40|58301|P.|1069843050|62720|1188|
10:18:07.061314|tcp|10.20.9.40|58301|10.20.6.40|9100|.|286555658|64240|0|
10:18:07.081314|tcp|10.20.9.40|58301|10.20.6.40|9100|F.|286555658|64240|0|
10:18:07.081814|tcp|10.20.6.40|9100|10.20.9.40|58301|F.|1069844238|62720|0|
10:18:07.082014|tcp|10.20.9.40|58301|10.20.6.40|9100|.|286555659|64240|0|
10:18:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 10
10:18:31.000747|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 10
10:18:53.344398|udp|10.20.6.40|34653|10.20.1.10|53|q|34825|0|64|34825+ A? rmg-monitor-01.ridgelinemed.example.
10:18:53.346401|udp|10.20.1.10|53|10.20.6.40|34653|r|34825|0|80|34825 1/0/0 A 10.20.9.40
10:19:07.000000|tcp|10.20.9.40|60738|10.20.6.40|9100|S|35497373|65535|0|
10:19:07.001167|tcp|10.20.6.40|9100|10.20.9.40|60738|S.|697710502|65535|0|
10:19:07.001538|tcp|10.20.9.40|60738|10.20.6.40|9100|.|35497374|65535|0|
10:19:07.049868|tcp|10.20.9.40|60738|10.20.6.40|9100|P.|35497374|65535|801|GET /metrics HTTP/1.1
10:19:07.054864|tcp|10.20.6.40|9100|10.20.9.40|60738|P.|697710503|65535|852|
10:19:07.055164|tcp|10.20.9.40|60738|10.20.6.40|9100|.|35498175|65535|0|
10:19:07.075164|tcp|10.20.9.40|60738|10.20.6.40|9100|F.|35498175|65535|0|
10:19:07.075664|tcp|10.20.6.40|9100|10.20.9.40|60738|F.|697711355|65535|0|
10:19:07.075864|tcp|10.20.9.40|60738|10.20.6.40|9100|.|35498176|65535|0|
10:19:42.437742|udp|10.20.6.40|46344|10.20.1.10|53|q|20195|0|39|20195+ A? ubuntu.com.
10:19:42.440201|udp|10.20.1.10|53|10.20.6.40|46344|r|20195|0|55|20195 1/0/0 A 192.0.2.30
10:20:06.381852|tcp|10.20.4.58|33213|10.20.6.40|443|S|2623074913|64240|0|
10:20:06.382417|tcp|10.20.6.40|443|10.20.4.58|33213|S.|3197549715|65535|0|
10:20:06.383310|tcp|10.20.4.58|33213|10.20.6.40|443|.|2623074914|64240|0|
10:20:06.400248|tcp|10.20.4.58|33213|10.20.6.40|443|P.|2623074914|64240|1008|TLS SNI: portal.ridgelinemed.example
10:20:06.402143|tcp|10.20.6.40|443|10.20.4.58|33213|P.|3197549716|65535|1555|
10:20:06.402443|tcp|10.20.4.58|33213|10.20.6.40|443|.|2623075922|64240|0|
10:20:06.456804|tcp|10.20.4.58|33213|10.20.6.40|443|P.|2623075922|64240|709|
10:20:06.461030|tcp|10.20.6.40|443|10.20.4.58|33213|P.|3197551271|65535|1942|
10:20:06.461330|tcp|10.20.4.58|33213|10.20.6.40|443|.|2623076631|64240|0|
10:20:06.486485|tcp|10.20.4.58|33213|10.20.6.40|443|P.|2623076631|64240|960|
10:20:06.491262|tcp|10.20.6.40|443|10.20.4.58|33213|P.|3197553213|65535|1357|
10:20:06.491562|tcp|10.20.4.58|33213|10.20.6.40|443|.|2623077591|64240|0|
10:20:06.507694|tcp|10.20.4.58|33213|10.20.6.40|443|P.|2623077591|64240|1183|
10:20:06.512526|tcp|10.20.6.40|443|10.20.4.58|33213|P.|3197554570|65535|1185|
10:20:06.512826|tcp|10.20.4.58|33213|10.20.6.40|443|.|2623078774|64240|0|
10:20:06.531961|tcp|10.20.4.58|33213|10.20.6.40|443|P.|2623078774|64240|911|
10:20:06.536972|tcp|10.20.6.40|443|10.20.4.58|33213|P.|3197555755|65535|1480|
10:20:06.537272|tcp|10.20.4.58|33213|10.20.6.40|443|.|2623079685|64240|0|
10:20:06.557025|tcp|10.20.4.58|33213|10.20.6.40|443|P.|2623079685|64240|1159|
10:20:06.562140|tcp|10.20.6.40|443|10.20.4.58|33213|P.|3197557235|65535|1135|
10:20:06.562440|tcp|10.20.4.58|33213|10.20.6.40|443|.|2623080844|64240|0|
10:20:06.587668|tcp|10.20.4.58|33213|10.20.6.40|443|P.|2623080844|64240|1320|
10:20:06.592874|tcp|10.20.6.40|443|10.20.4.58|33213|P.|3197558370|65535|2164|
10:20:06.593174|tcp|10.20.4.58|33213|10.20.6.40|443|.|2623082164|64240|0|
10:20:06.606529|tcp|10.20.4.58|33213|10.20.6.40|443|P.|2623082164|64240|942|
10:20:06.607620|tcp|10.20.6.40|443|10.20.4.58|33213|P.|3197560534|65535|1307|
10:20:06.607920|tcp|10.20.4.58|33213|10.20.6.40|443|.|2623083106|64240|0|
10:20:06.647764|tcp|10.20.4.58|33213|10.20.6.40|443|P.|2623083106|64240|847|
10:20:06.650815|tcp|10.20.6.40|443|10.20.4.58|33213|P.|3197561841|65535|977|
10:20:06.651115|tcp|10.20.4.58|33213|10.20.6.40|443|.|2623083953|64240|0|
10:20:06.671115|tcp|10.20.4.58|33213|10.20.6.40|443|F.|2623083953|64240|0|
10:20:06.671615|tcp|10.20.6.40|443|10.20.4.58|33213|F.|3197562818|65535|0|
10:20:06.671815|tcp|10.20.4.58|33213|10.20.6.40|443|.|2623083954|64240|0|
10:20:07.000000|tcp|10.20.9.40|34678|10.20.6.40|9100|S|2950463152|65535|0|
10:20:07.000900|tcp|10.20.6.40|9100|10.20.9.40|34678|S.|3036207332|29200|0|
10:20:07.002081|tcp|10.20.9.40|34678|10.20.6.40|9100|.|2950463153|65535|0|
10:20:07.034447|tcp|10.20.9.40|34678|10.20.6.40|9100|P.|2950463153|65535|870|GET /metrics HTTP/1.1
10:20:07.036598|tcp|10.20.6.40|9100|10.20.9.40|34678|P.|3036207333|29200|1786|
10:20:07.036898|tcp|10.20.9.40|34678|10.20.6.40|9100|.|2950464023|65535|0|
10:20:07.056898|tcp|10.20.9.40|34678|10.20.6.40|9100|F.|2950464023|65535|0|
10:20:07.057398|tcp|10.20.6.40|9100|10.20.9.40|34678|F.|3036209119|29200|0|
10:20:07.057598|tcp|10.20.9.40|34678|10.20.6.40|9100|.|2950464024|65535|0|
10:20:19.971600|udp|10.20.6.40|46293|10.20.1.10|53|q|32286|0|56|32286+ A? portal.ridgelinemed.example.
10:20:19.975153|udp|10.20.1.10|53|10.20.6.40|46293|r|32286|0|72|32286 1/0/0 A 10.20.6.40
10:20:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 11
10:20:31.000543|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 11
10:21:05.752833|udp|10.20.6.40|59102|10.20.1.10|53|q|42270|0|44|42270+ A? www.example.com.
10:21:05.756204|udp|10.20.1.10|53|10.20.6.40|59102|r|42270|0|60|42270 1/0/0 A 192.0.2.10
10:21:07.000000|tcp|10.20.9.40|51970|10.20.6.40|9100|S|1347136691|65535|0|
10:21:07.000477|tcp|10.20.6.40|9100|10.20.9.40|51970|S.|954082539|62720|0|
10:21:07.001010|tcp|10.20.9.40|51970|10.20.6.40|9100|.|1347136692|65535|0|
10:21:07.014692|tcp|10.20.9.40|51970|10.20.6.40|9100|P.|1347136692|65535|524|GET /metrics HTTP/1.1
10:21:07.016167|tcp|10.20.6.40|9100|10.20.9.40|51970|P.|954082540|62720|499|
10:21:07.016467|tcp|10.20.9.40|51970|10.20.6.40|9100|.|1347137216|65535|0|
10:21:07.036467|tcp|10.20.9.40|51970|10.20.6.40|9100|F.|1347137216|65535|0|
10:21:07.036967|tcp|10.20.6.40|9100|10.20.9.40|51970|F.|954083039|62720|0|
10:21:07.037167|tcp|10.20.9.40|51970|10.20.6.40|9100|.|1347137217|65535|0|
10:21:45.798884|udp|10.20.6.40|44543|10.20.1.10|53|q|41176|0|56|41176+ A? portal.ridgelinemed.example.
10:21:45.802684|udp|10.20.1.10|53|10.20.6.40|44543|r|41176|0|72|41176 1/0/0 A 10.20.6.40
10:22:07.000000|tcp|10.20.9.40|48687|10.20.6.40|9100|S|2794755468|64240|0|
10:22:07.001353|tcp|10.20.6.40|9100|10.20.9.40|48687|S.|2349435832|64240|0|
10:22:07.001806|tcp|10.20.9.40|48687|10.20.6.40|9100|.|2794755469|64240|0|
10:22:07.056899|tcp|10.20.9.40|48687|10.20.6.40|9100|P.|2794755469|64240|487|GET /metrics HTTP/1.1
10:22:07.062194|tcp|10.20.6.40|9100|10.20.9.40|48687|P.|2349435833|64240|1245|
10:22:07.062494|tcp|10.20.9.40|48687|10.20.6.40|9100|.|2794755956|64240|0|
10:22:07.082494|tcp|10.20.9.40|48687|10.20.6.40|9100|F.|2794755956|64240|0|
10:22:07.082994|tcp|10.20.6.40|9100|10.20.9.40|48687|F.|2349437078|64240|0|
10:22:07.083194|tcp|10.20.9.40|48687|10.20.6.40|9100|.|2794755957|64240|0|
10:22:10.580784|tcp|10.20.4.58|45036|10.20.6.40|443|S|1109073360|29200|0|
10:22:10.581861|tcp|10.20.6.40|443|10.20.4.58|45036|S.|351273088|64240|0|
10:22:10.582974|tcp|10.20.4.58|45036|10.20.6.40|443|.|1109073361|29200|0|
10:22:10.615980|tcp|10.20.4.58|45036|10.20.6.40|443|P.|1109073361|29200|927|TLS SNI: portal.ridgelinemed.example
10:22:10.617927|tcp|10.20.6.40|443|10.20.4.58|45036|P.|351273089|64240|1002|
10:22:10.618227|tcp|10.20.4.58|45036|10.20.6.40|443|.|1109074288|29200|0|
10:22:10.673452|tcp|10.20.4.58|45036|10.20.6.40|443|P.|1109074288|29200|1029|
10:22:10.677717|tcp|10.20.6.40|443|10.20.4.58|45036|P.|351274091|64240|1509|
10:22:10.678017|tcp|10.20.4.58|45036|10.20.6.40|443|.|1109075317|29200|0|
10:22:10.716450|tcp|10.20.4.58|45036|10.20.6.40|443|P.|1109075317|29200|1039|
10:22:10.717644|tcp|10.20.6.40|443|10.20.4.58|45036|P.|351275600|64240|2776|
10:22:10.717944|tcp|10.20.4.58|45036|10.20.6.40|443|.|1109076356|29200|0|
10:22:10.756695|tcp|10.20.4.58|45036|10.20.6.40|443|P.|1109076356|29200|1022|
10:22:10.761467|tcp|10.20.6.40|443|10.20.4.58|45036|P.|351278376|64240|1125|
10:22:10.761767|tcp|10.20.4.58|45036|10.20.6.40|443|.|1109077378|29200|0|
10:22:10.795647|tcp|10.20.4.58|45036|10.20.6.40|443|P.|1109077378|29200|719|
10:22:10.797027|tcp|10.20.6.40|443|10.20.4.58|45036|P.|351279501|64240|839|
10:22:10.797327|tcp|10.20.4.58|45036|10.20.6.40|443|.|1109078097|29200|0|
10:22:10.820248|tcp|10.20.4.58|45036|10.20.6.40|443|P.|1109078097|29200|1357|
10:22:10.824462|tcp|10.20.6.40|443|10.20.4.58|45036|P.|351280340|64240|1525|
10:22:10.824762|tcp|10.20.4.58|45036|10.20.6.40|443|.|1109079454|29200|0|
10:22:10.844539|tcp|10.20.4.58|45036|10.20.6.40|443|P.|1109079454|29200|1244|
10:22:10.850357|tcp|10.20.6.40|443|10.20.4.58|45036|P.|351281865|64240|2113|
10:22:10.850657|tcp|10.20.4.58|45036|10.20.6.40|443|.|1109080698|29200|0|
10:22:10.870657|tcp|10.20.4.58|45036|10.20.6.40|443|F.|1109080698|29200|0|
10:22:10.871157|tcp|10.20.6.40|443|10.20.4.58|45036|F.|351283978|64240|0|
10:22:10.871357|tcp|10.20.4.58|45036|10.20.6.40|443|.|1109080699|29200|0|
10:22:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 12
10:22:31.000776|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 12
10:22:39.602523|udp|10.20.6.40|42264|10.20.1.10|53|q|2163|0|56|2163+ A? portal.ridgelinemed.example.
10:22:39.605295|udp|10.20.1.10|53|10.20.6.40|42264|r|2163|0|72|2163 1/0/0 A 10.20.6.40
10:23:07.000000|tcp|10.20.9.40|54914|10.20.6.40|9100|S|2831567680|62720|0|
10:23:07.001157|tcp|10.20.6.40|9100|10.20.9.40|54914|S.|3459784811|65535|0|
10:23:07.001440|tcp|10.20.9.40|54914|10.20.6.40|9100|.|2831567681|62720|0|
10:23:07.021018|tcp|10.20.9.40|54914|10.20.6.40|9100|P.|2831567681|62720|707|GET /metrics HTTP/1.1
10:23:07.025365|tcp|10.20.6.40|9100|10.20.9.40|54914|P.|3459784812|65535|1282|
10:23:07.025665|tcp|10.20.9.40|54914|10.20.6.40|9100|.|2831568388|62720|0|
10:23:07.045665|tcp|10.20.9.40|54914|10.20.6.40|9100|F.|2831568388|62720|0|
10:23:07.046165|tcp|10.20.6.40|9100|10.20.9.40|54914|F.|3459786094|65535|0|
10:23:07.046365|tcp|10.20.9.40|54914|10.20.6.40|9100|.|2831568389|62720|0|
10:23:38.032958|udp|10.20.6.40|33587|10.20.1.10|53|q|40736|0|40|40736+ A? example.com.
10:23:38.035308|udp|10.20.1.10|53|10.20.6.40|33587|r|40736|0|56|40736 1/0/0 A 192.0.2.10
10:24:07.000000|tcp|10.20.9.40|38859|10.20.6.40|9100|S|946060690|64240|0|
10:24:07.001353|tcp|10.20.6.40|9100|10.20.9.40|38859|S.|568460454|62720|0|
10:24:07.001857|tcp|10.20.9.40|38859|10.20.6.40|9100|.|946060691|64240|0|
10:24:07.028672|tcp|10.20.9.40|38859|10.20.6.40|9100|P.|946060691|64240|767|GET /metrics HTTP/1.1
10:24:07.031848|tcp|10.20.6.40|9100|10.20.9.40|38859|P.|568460455|62720|1646|
10:24:07.032148|tcp|10.20.9.40|38859|10.20.6.40|9100|.|946061458|64240|0|
10:24:07.052148|tcp|10.20.9.40|38859|10.20.6.40|9100|F.|946061458|64240|0|
10:24:07.052648|tcp|10.20.6.40|9100|10.20.9.40|38859|F.|568462101|62720|0|
10:24:07.052848|tcp|10.20.9.40|38859|10.20.6.40|9100|.|946061459|64240|0|
10:24:16.399498|udp|10.20.6.40|47902|10.20.1.10|53|q|49174|0|64|49174+ A? rmg-monitor-01.ridgelinemed.example.
10:24:16.402570|udp|10.20.1.10|53|10.20.6.40|47902|r|49174|0|80|49174 1/0/0 A 10.20.9.40
10:24:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 13
10:24:31.000567|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 13
10:24:58.476866|udp|10.20.6.40|54707|10.20.1.10|53|q|47302|0|40|47302+ A? example.com.
10:24:58.479166|udp|10.20.1.10|53|10.20.6.40|54707|r|47302|0|56|47302 1/0/0 A 192.0.2.10
10:25:07.000000|tcp|10.20.9.40|48669|10.20.6.40|9100|S|2942018060|62720|0|
10:25:07.000773|tcp|10.20.6.40|9100|10.20.9.40|48669|S.|3582957928|29200|0|
10:25:07.001667|tcp|10.20.9.40|48669|10.20.6.40|9100|.|2942018061|62720|0|
10:25:07.043304|tcp|10.20.9.40|48669|10.20.6.40|9100|P.|2942018061|62720|770|GET /metrics HTTP/1.1
10:25:07.046456|tcp|10.20.6.40|9100|10.20.9.40|48669|P.|3582957929|29200|805|
10:25:07.046756|tcp|10.20.9.40|48669|10.20.6.40|9100|.|2942018831|62720|0|
10:25:07.066756|tcp|10.20.9.40|48669|10.20.6.40|9100|F.|2942018831|62720|0|
10:25:07.067256|tcp|10.20.6.40|9100|10.20.9.40|48669|F.|3582958734|29200|0|
10:25:07.067456|tcp|10.20.9.40|48669|10.20.6.40|9100|.|2942018832|62720|0|
10:26:03.354467|udp|10.20.6.40|38748|10.20.1.10|53|q|39886|0|44|39886+ A? www.example.com.
10:26:03.357720|udp|10.20.1.10|53|10.20.6.40|38748|r|39886|0|60|39886 1/0/0 A 192.0.2.10
10:26:07.000000|tcp|10.20.9.40|51608|10.20.6.40|9100|S|669318871|62720|0|
10:26:07.000735|tcp|10.20.6.40|9100|10.20.9.40|51608|S.|3215704664|62720|0|
10:26:07.001730|tcp|10.20.9.40|51608|10.20.6.40|9100|.|669318872|62720|0|
10:26:07.036277|tcp|10.20.9.40|51608|10.20.6.40|9100|P.|669318872|62720|641|GET /metrics HTTP/1.1
10:26:07.038493|tcp|10.20.6.40|9100|10.20.9.40|51608|P.|3215704665|62720|926|
10:26:07.038793|tcp|10.20.9.40|51608|10.20.6.40|9100|.|669319513|62720|0|
10:26:07.058793|tcp|10.20.9.40|51608|10.20.6.40|9100|F.|669319513|62720|0|
10:26:07.059293|tcp|10.20.6.40|9100|10.20.9.40|51608|F.|3215705591|62720|0|
10:26:07.059493|tcp|10.20.9.40|51608|10.20.6.40|9100|.|669319514|62720|0|
10:26:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 14
10:26:31.000395|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 14
10:26:54.394972|tcp|10.20.4.12|43793|10.20.6.40|443|S|3130786972|65535|0|
10:26:54.395432|tcp|10.20.6.40|443|10.20.4.12|43793|S.|2069346236|65535|0|
10:26:54.396574|tcp|10.20.4.12|43793|10.20.6.40|443|.|3130786973|65535|0|
10:26:54.447925|tcp|10.20.4.12|43793|10.20.6.40|443|P.|3130786973|65535|778|TLS SNI: portal.ridgelinemed.example
10:26:54.452997|tcp|10.20.6.40|443|10.20.4.12|43793|P.|2069346237|65535|1353|
10:26:54.453297|tcp|10.20.4.12|43793|10.20.6.40|443|.|3130787751|65535|0|
10:26:54.506132|tcp|10.20.4.12|43793|10.20.6.40|443|P.|3130787751|65535|1143|
10:26:54.509612|tcp|10.20.6.40|443|10.20.4.12|43793|P.|2069347590|65535|1715|
10:26:54.509912|tcp|10.20.4.12|43793|10.20.6.40|443|.|3130788894|65535|0|
10:26:54.525034|tcp|10.20.4.12|43793|10.20.6.40|443|P.|3130788894|65535|1301|
10:26:54.529547|tcp|10.20.6.40|443|10.20.4.12|43793|P.|2069349305|65535|1727|
10:26:54.529847|tcp|10.20.4.12|43793|10.20.6.40|443|.|3130790195|65535|0|
10:26:54.548448|tcp|10.20.4.12|43793|10.20.6.40|443|P.|3130790195|65535|706|
10:26:54.550802|tcp|10.20.6.40|443|10.20.4.12|43793|P.|2069351032|65535|1393|
10:26:54.551102|tcp|10.20.4.12|43793|10.20.6.40|443|.|3130790901|65535|0|
10:26:54.592237|tcp|10.20.4.12|43793|10.20.6.40|443|P.|3130790901|65535|1054|
10:26:54.595701|tcp|10.20.6.40|443|10.20.4.12|43793|P.|2069352425|65535|2443|
10:26:54.596001|tcp|10.20.4.12|43793|10.20.6.40|443|.|3130791955|65535|0|
10:26:54.623033|tcp|10.20.4.12|43793|10.20.6.40|443|P.|3130791955|65535|1091|
10:26:54.625270|tcp|10.20.6.40|443|10.20.4.12|43793|P.|2069354868|65535|2569|
10:26:54.625570|tcp|10.20.4.12|43793|10.20.6.40|443|.|3130793046|65535|0|
10:26:54.645570|tcp|10.20.4.12|43793|10.20.6.40|443|F.|3130793046|65535|0|
10:26:54.646070|tcp|10.20.6.40|443|10.20.4.12|43793|F.|2069357437|65535|0|
10:26:54.646270|tcp|10.20.4.12|43793|10.20.6.40|443|.|3130793047|65535|0|
10:27:04.065266|udp|10.20.6.40|42507|10.20.1.10|53|q|46291|0|40|46291+ A? example.com.
10:27:04.067661|udp|10.20.1.10|53|10.20.6.40|42507|r|46291|0|56|46291 1/0/0 A 192.0.2.10
10:27:07.000000|tcp|10.20.9.40|50838|10.20.6.40|9100|S|146661571|29200|0|
10:27:07.001187|tcp|10.20.6.40|9100|10.20.9.40|50838|S.|1463674970|65535|0|
10:27:07.001641|tcp|10.20.9.40|50838|10.20.6.40|9100|.|146661572|29200|0|
10:27:07.030998|tcp|10.20.9.40|50838|10.20.6.40|9100|P.|146661572|29200|824|GET /metrics HTTP/1.1
10:27:07.034682|tcp|10.20.6.40|9100|10.20.9.40|50838|P.|1463674971|65535|1008|
10:27:07.034982|tcp|10.20.9.40|50838|10.20.6.40|9100|.|146662396|29200|0|
10:27:07.054982|tcp|10.20.9.40|50838|10.20.6.40|9100|F.|146662396|29200|0|
10:27:07.055482|tcp|10.20.6.40|9100|10.20.9.40|50838|F.|1463675979|65535|0|
10:27:07.055682|tcp|10.20.9.40|50838|10.20.6.40|9100|.|146662397|29200|0|
10:27:34.549372|tcp|10.20.6.40|54666|192.0.2.20|443|S|1028171188|29200|0|
10:27:34.550432|tcp|192.0.2.20|443|10.20.6.40|54666|S.|908988064|65535|0|
10:27:34.551293|tcp|10.20.6.40|54666|192.0.2.20|443|.|1028171189|29200|0|
10:27:34.608078|tcp|10.20.6.40|54666|192.0.2.20|443|P.|1028171189|29200|622|TLS SNI: search.example.net
10:27:34.609951|tcp|192.0.2.20|443|10.20.6.40|54666|P.|908988065|65535|1593|
10:27:34.610251|tcp|10.20.6.40|54666|192.0.2.20|443|.|1028171811|29200|0|
10:27:34.646418|tcp|10.20.6.40|54666|192.0.2.20|443|P.|1028171811|29200|1121|
10:27:34.652294|tcp|192.0.2.20|443|10.20.6.40|54666|P.|908989658|65535|1174|
10:27:34.652594|tcp|10.20.6.40|54666|192.0.2.20|443|.|1028172932|29200|0|
10:27:34.668515|tcp|10.20.6.40|54666|192.0.2.20|443|P.|1028172932|29200|871|
10:27:34.672305|tcp|192.0.2.20|443|10.20.6.40|54666|P.|908990832|65535|1920|
10:27:34.672605|tcp|10.20.6.40|54666|192.0.2.20|443|.|1028173803|29200|0|
10:27:34.692605|tcp|10.20.6.40|54666|192.0.2.20|443|F.|1028173803|29200|0|
10:27:34.693105|tcp|192.0.2.20|443|10.20.6.40|54666|F.|908992752|65535|0|
10:27:34.693305|tcp|10.20.6.40|54666|192.0.2.20|443|.|1028173804|29200|0|
10:28:03.863662|udp|10.20.6.40|45525|10.20.1.10|53|q|24702|0|63|24702+ A? rmg-backup-01.ridgelinemed.example.
10:28:03.866016|udp|10.20.1.10|53|10.20.6.40|45525|r|24702|0|79|24702 1/0/0 A 10.20.9.15
10:28:07.000000|tcp|10.20.9.40|40836|10.20.6.40|9100|S|2177587711|29200|0|
10:28:07.001357|tcp|10.20.6.40|9100|10.20.9.40|40836|S.|476561561|65535|0|
10:28:07.002318|tcp|10.20.9.40|40836|10.20.6.40|9100|.|2177587712|29200|0|
10:28:07.017651|tcp|10.20.9.40|40836|10.20.6.40|9100|P.|2177587712|29200|635|GET /metrics HTTP/1.1
10:28:07.020319|tcp|10.20.6.40|9100|10.20.9.40|40836|P.|476561562|65535|910|
10:28:07.020619|tcp|10.20.9.40|40836|10.20.6.40|9100|.|2177588347|29200|0|
10:28:07.040619|tcp|10.20.9.40|40836|10.20.6.40|9100|F.|2177588347|29200|0|
10:28:07.041119|tcp|10.20.6.40|9100|10.20.9.40|40836|F.|476562472|65535|0|
10:28:07.041319|tcp|10.20.9.40|40836|10.20.6.40|9100|.|2177588348|29200|0|
10:28:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 15
10:28:31.000772|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 15
10:28:50.078259|udp|10.20.6.40|54951|10.20.1.10|53|q|16592|0|44|16592+ A? www.example.com.
10:28:50.080630|udp|10.20.1.10|53|10.20.6.40|54951|r|16592|0|60|16592 1/0/0 A 192.0.2.10
10:29:07.000000|tcp|10.20.9.40|33832|10.20.6.40|9100|S|2526289863|64240|0|
10:29:07.001360|tcp|10.20.6.40|9100|10.20.9.40|33832|S.|1513362214|65535|0|
10:29:07.002017|tcp|10.20.9.40|33832|10.20.6.40|9100|.|2526289864|64240|0|
10:29:07.044650|tcp|10.20.9.40|33832|10.20.6.40|9100|P.|2526289864|64240|845|GET /metrics HTTP/1.1
10:29:07.046192|tcp|10.20.6.40|9100|10.20.9.40|33832|P.|1513362215|65535|1044|
10:29:07.046492|tcp|10.20.9.40|33832|10.20.6.40|9100|.|2526290709|64240|0|
10:29:07.066492|tcp|10.20.9.40|33832|10.20.6.40|9100|F.|2526290709|64240|0|
10:29:07.066992|tcp|10.20.6.40|9100|10.20.9.40|33832|F.|1513363259|65535|0|
10:29:07.067192|tcp|10.20.9.40|33832|10.20.6.40|9100|.|2526290710|64240|0|
10:29:38.651797|udp|10.20.6.40|45645|10.20.1.10|53|q|58987|0|63|58987+ A? rmg-backup-01.ridgelinemed.example.
10:29:38.654967|udp|10.20.1.10|53|10.20.6.40|45645|r|58987|0|79|58987 1/0/0 A 10.20.9.15
10:29:43.172680|tcp|10.20.6.40|54413|192.0.2.20|443|S|317505539|62720|0|
10:29:43.173304|tcp|192.0.2.20|443|10.20.6.40|54413|S.|2006667387|65535|0|
10:29:43.174027|tcp|10.20.6.40|54413|192.0.2.20|443|.|317505540|62720|0|
10:29:43.205113|tcp|10.20.6.40|54413|192.0.2.20|443|P.|317505540|62720|952|TLS SNI: search.example.net
10:29:43.207702|tcp|192.0.2.20|443|10.20.6.40|54413|P.|2006667388|65535|2231|
10:29:43.208002|tcp|10.20.6.40|54413|192.0.2.20|443|.|317506492|62720|0|
10:29:43.266657|tcp|10.20.6.40|54413|192.0.2.20|443|P.|317506492|62720|998|
10:29:43.271780|tcp|192.0.2.20|443|10.20.6.40|54413|P.|2006669619|65535|1482|
10:29:43.272080|tcp|10.20.6.40|54413|192.0.2.20|443|.|317507490|62720|0|
10:29:43.322673|tcp|10.20.6.40|54413|192.0.2.20|443|P.|317507490|62720|688|
10:29:43.324737|tcp|192.0.2.20|443|10.20.6.40|54413|P.|2006671101|65535|1521|
10:29:43.325037|tcp|10.20.6.40|54413|192.0.2.20|443|.|317508178|62720|0|
10:29:43.358036|tcp|10.20.6.40|54413|192.0.2.20|443|P.|317508178|62720|1190|
10:29:43.363395|tcp|192.0.2.20|443|10.20.6.40|54413|P.|2006672622|65535|1874|
10:29:43.363695|tcp|10.20.6.40|54413|192.0.2.20|443|.|317509368|62720|0|
10:29:43.383695|tcp|10.20.6.40|54413|192.0.2.20|443|F.|317509368|62720|0|
10:29:43.384195|tcp|192.0.2.20|443|10.20.6.40|54413|F.|2006674496|65535|0|
10:29:43.384395|tcp|10.20.6.40|54413|192.0.2.20|443|.|317509369|62720|0|
10:30:07.000000|tcp|10.20.9.40|45549|10.20.6.40|9100|S|667187446|64240|0|
10:30:07.001222|tcp|10.20.6.40|9100|10.20.9.40|45549|S.|601826241|62720|0|
10:30:07.001905|tcp|10.20.9.40|45549|10.20.6.40|9100|.|667187447|64240|0|
10:30:07.037105|tcp|10.20.9.40|45549|10.20.6.40|9100|P.|667187447|64240|781|GET /metrics HTTP/1.1
10:30:07.041946|tcp|10.20.6.40|9100|10.20.9.40|45549|P.|601826242|62720|1302|
10:30:07.042246|tcp|10.20.9.40|45549|10.20.6.40|9100|.|667188228|64240|0|
10:30:07.062246|tcp|10.20.9.40|45549|10.20.6.40|9100|F.|667188228|64240|0|
10:30:07.062746|tcp|10.20.6.40|9100|10.20.9.40|45549|F.|601827544|62720|0|
10:30:07.062946|tcp|10.20.9.40|45549|10.20.6.40|9100|.|667188229|64240|0|
10:30:13.277395|udp|10.20.6.40|41979|10.20.1.10|53|q|38064|0|63|38064+ A? rmg-backup-01.ridgelinemed.example.
10:30:13.281352|udp|10.20.1.10|53|10.20.6.40|41979|r|38064|0|79|38064 1/0/0 A 10.20.9.15
10:30:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 16
10:30:31.000332|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 16
10:31:07.000000|tcp|10.20.9.40|59443|10.20.6.40|9100|S|2306651713|29200|0|
10:31:07.000745|tcp|10.20.6.40|9100|10.20.9.40|59443|S.|2503782523|29200|0|
10:31:07.001803|tcp|10.20.9.40|59443|10.20.6.40|9100|.|2306651714|29200|0|
10:31:07.013212|tcp|10.20.9.40|59443|10.20.6.40|9100|P.|2306651714|29200|819|GET /metrics HTTP/1.1
10:31:07.016069|tcp|10.20.6.40|9100|10.20.9.40|59443|P.|2503782524|29200|701|
10:31:07.016369|tcp|10.20.9.40|59443|10.20.6.40|9100|.|2306652533|29200|0|
10:31:07.036369|tcp|10.20.9.40|59443|10.20.6.40|9100|F.|2306652533|29200|0|
10:31:07.036869|tcp|10.20.6.40|9100|10.20.9.40|59443|F.|2503783225|29200|0|
10:31:07.037069|tcp|10.20.9.40|59443|10.20.6.40|9100|.|2306652534|29200|0|
10:31:07.420245|tcp|10.20.4.58|40230|10.20.6.40|443|S|3041021188|62720|0|
10:31:07.421058|tcp|10.20.6.40|443|10.20.4.58|40230|S.|58836305|65535|0|
10:31:07.421893|tcp|10.20.4.58|40230|10.20.6.40|443|.|3041021189|62720|0|
10:31:07.452715|tcp|10.20.4.58|40230|10.20.6.40|443|P.|3041021189|62720|1296|TLS SNI: portal.ridgelinemed.example
10:31:07.458099|tcp|10.20.6.40|443|10.20.4.58|40230|P.|58836306|65535|1320|
10:31:07.458399|tcp|10.20.4.58|40230|10.20.6.40|443|.|3041022485|62720|0|
10:31:07.469163|tcp|10.20.4.58|40230|10.20.6.40|443|P.|3041022485|62720|748|
10:31:07.473041|tcp|10.20.6.40|443|10.20.4.58|40230|P.|58837626|65535|1533|
10:31:07.473341|tcp|10.20.4.58|40230|10.20.6.40|443|.|3041023233|62720|0|
10:31:07.495634|tcp|10.20.4.58|40230|10.20.6.40|443|P.|3041023233|62720|1266|
10:31:07.497195|tcp|10.20.6.40|443|10.20.4.58|40230|P.|58839159|65535|1655|
10:31:07.497495|tcp|10.20.4.58|40230|10.20.6.40|443|.|3041024499|62720|0|
10:31:07.556934|tcp|10.20.4.58|40230|10.20.6.40|443|P.|3041024499|62720|1014|
10:31:07.560917|tcp|10.20.6.40|443|10.20.4.58|40230|P.|58840814|65535|1718|
10:31:07.561217|tcp|10.20.4.58|40230|10.20.6.40|443|.|3041025513|62720|0|
10:31:07.600382|tcp|10.20.4.58|40230|10.20.6.40|443|P.|3041025513|62720|1041|
10:31:07.605749|tcp|10.20.6.40|443|10.20.4.58|40230|P.|58842532|65535|2295|
10:31:07.606049|tcp|10.20.4.58|40230|10.20.6.40|443|.|3041026554|62720|0|
10:31:07.626049|tcp|10.20.4.58|40230|10.20.6.40|443|F.|3041026554|62720|0|
10:31:07.626549|tcp|10.20.6.40|443|10.20.4.58|40230|F.|58844827|65535|0|
10:31:07.626749|tcp|10.20.4.58|40230|10.20.6.40|443|.|3041026555|62720|0|
10:31:12.806225|tcp|10.20.6.40|42609|192.0.2.30|443|S|962036284|65535|0|
10:31:12.806906|tcp|192.0.2.30|443|10.20.6.40|42609|S.|2868488248|64240|0|
10:31:12.807396|tcp|10.20.6.40|42609|192.0.2.30|443|.|962036285|65535|0|
10:31:12.852682|tcp|10.20.6.40|42609|192.0.2.30|443|P.|962036285|65535|775|TLS SNI: packages.example.org
10:31:12.854620|tcp|192.0.2.30|443|10.20.6.40|42609|P.|2868488249|64240|2244|
10:31:12.854920|tcp|10.20.6.40|42609|192.0.2.30|443|.|962037060|65535|0|
10:31:12.881189|tcp|10.20.6.40|42609|192.0.2.30|443|P.|962037060|65535|605|
10:31:12.886907|tcp|192.0.2.30|443|10.20.6.40|42609|P.|2868490493|64240|1405|
10:31:12.887207|tcp|10.20.6.40|42609|192.0.2.30|443|.|962037665|65535|0|
10:31:12.921036|tcp|10.20.6.40|42609|192.0.2.30|443|P.|962037665|65535|867|
10:31:12.926127|tcp|192.0.2.30|443|10.20.6.40|42609|P.|2868491898|64240|734|
10:31:12.926427|tcp|10.20.6.40|42609|192.0.2.30|443|.|962038532|65535|0|
10:31:12.955206|tcp|10.20.6.40|42609|192.0.2.30|443|P.|962038532|65535|1199|
10:31:12.960200|tcp|192.0.2.30|443|10.20.6.40|42609|P.|2868492632|64240|772|
10:31:12.960500|tcp|10.20.6.40|42609|192.0.2.30|443|.|962039731|65535|0|
10:31:12.977511|tcp|10.20.6.40|42609|192.0.2.30|443|P.|962039731|65535|870|
10:31:12.978864|tcp|192.0.2.30|443|10.20.6.40|42609|P.|2868493404|64240|841|
10:31:12.979164|tcp|10.20.6.40|42609|192.0.2.30|443|.|962040601|65535|0|
10:31:12.999164|tcp|10.20.6.40|42609|192.0.2.30|443|F.|962040601|65535|0|
10:31:12.999664|tcp|192.0.2.30|443|10.20.6.40|42609|F.|2868494245|64240|0|
10:31:12.999864|tcp|10.20.6.40|42609|192.0.2.30|443|.|962040602|65535|0|
10:31:19.359058|tcp|10.20.6.40|43718|192.0.2.30|443|S|1165221134|65535|0|
10:31:19.360226|tcp|192.0.2.30|443|10.20.6.40|43718|S.|249972427|64240|0|
10:31:19.361329|tcp|10.20.6.40|43718|192.0.2.30|443|.|1165221135|65535|0|
10:31:19.387925|tcp|10.20.6.40|43718|192.0.2.30|443|P.|1165221135|65535|634|TLS SNI: packages.example.org
10:31:19.389398|tcp|192.0.2.30|443|10.20.6.40|43718|P.|249972428|64240|828|
10:31:19.389698|tcp|10.20.6.40|43718|192.0.2.30|443|.|1165221769|65535|0|
10:31:19.404980|tcp|10.20.6.40|43718|192.0.2.30|443|P.|1165221769|65535|811|
10:31:19.407502|tcp|192.0.2.30|443|10.20.6.40|43718|P.|249973256|64240|1183|
10:31:19.407802|tcp|10.20.6.40|43718|192.0.2.30|443|.|1165222580|65535|0|
10:31:19.427802|tcp|10.20.6.40|43718|192.0.2.30|443|F.|1165222580|65535|0|
10:31:19.428302|tcp|192.0.2.30|443|10.20.6.40|43718|F.|249974439|64240|0|
10:31:19.428502|tcp|10.20.6.40|43718|192.0.2.30|443|.|1165222581|65535|0|
10:31:20.657848|udp|10.20.6.40|58379|10.20.1.10|53|q|58677|0|56|58677+ A? portal.ridgelinemed.example.
10:31:20.661686|udp|10.20.1.10|53|10.20.6.40|58379|r|58677|0|72|58677 1/0/0 A 10.20.6.40
10:31:59.948405|udp|10.20.6.40|33701|10.20.1.10|53|q|55586|0|56|55586+ A? portal.ridgelinemed.example.
10:31:59.951476|udp|10.20.1.10|53|10.20.6.40|33701|r|55586|0|72|55586 1/0/0 A 10.20.6.40
10:32:07.000000|tcp|10.20.9.40|52983|10.20.6.40|9100|S|2712270102|65535|0|
10:32:07.001096|tcp|10.20.6.40|9100|10.20.9.40|52983|S.|3287626073|64240|0|
10:32:07.001758|tcp|10.20.9.40|52983|10.20.6.40|9100|.|2712270103|65535|0|
10:32:07.024985|tcp|10.20.9.40|52983|10.20.6.40|9100|P.|2712270103|65535|611|GET /metrics HTTP/1.1
10:32:07.029368|tcp|10.20.6.40|9100|10.20.9.40|52983|P.|3287626074|64240|690|
10:32:07.029668|tcp|10.20.9.40|52983|10.20.6.40|9100|.|2712270714|65535|0|
10:32:07.049668|tcp|10.20.9.40|52983|10.20.6.40|9100|F.|2712270714|65535|0|
10:32:07.050168|tcp|10.20.6.40|9100|10.20.9.40|52983|F.|3287626764|64240|0|
10:32:07.050368|tcp|10.20.9.40|52983|10.20.6.40|9100|.|2712270715|65535|0|
10:32:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 17
10:32:31.000431|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 17
10:32:42.912567|udp|10.20.6.40|39162|10.20.1.10|53|q|39977|0|39|39977+ A? ubuntu.com.
10:32:42.915298|udp|10.20.1.10|53|10.20.6.40|39162|r|39977|0|55|39977 1/0/0 A 192.0.2.30
10:33:07.000000|tcp|10.20.9.40|53966|10.20.6.40|9100|S|2676398553|65535|0|
10:33:07.000546|tcp|10.20.6.40|9100|10.20.9.40|53966|S.|2285755268|65535|0|
10:33:07.000974|tcp|10.20.9.40|53966|10.20.6.40|9100|.|2676398554|65535|0|
10:33:07.030140|tcp|10.20.9.40|53966|10.20.6.40|9100|P.|2676398554|65535|681|GET /metrics HTTP/1.1
10:33:07.035006|tcp|10.20.6.40|9100|10.20.9.40|53966|P.|2285755269|65535|1721|
10:33:07.035306|tcp|10.20.9.40|53966|10.20.6.40|9100|.|2676399235|65535|0|
10:33:07.055306|tcp|10.20.9.40|53966|10.20.6.40|9100|F.|2676399235|65535|0|
10:33:07.055806|tcp|10.20.6.40|9100|10.20.9.40|53966|F.|2285756990|65535|0|
10:33:07.056006|tcp|10.20.9.40|53966|10.20.6.40|9100|.|2676399236|65535|0|
10:33:12.764619|tcp|10.20.4.58|52787|10.20.6.40|443|S|3719466425|65535|0|
10:33:12.765694|tcp|10.20.6.40|443|10.20.4.58|52787|S.|3846876638|65535|0|
10:33:12.766672|tcp|10.20.4.58|52787|10.20.6.40|443|.|3719466426|65535|0|
10:33:12.809440|tcp|10.20.4.58|52787|10.20.6.40|443|P.|3719466426|65535|1150|TLS SNI: portal.ridgelinemed.example
10:33:12.814117|tcp|10.20.6.40|443|10.20.4.58|52787|P.|3846876639|65535|1507|
10:33:12.814417|tcp|10.20.4.58|52787|10.20.6.40|443|.|3719467576|65535|0|
10:33:12.829697|tcp|10.20.4.58|52787|10.20.6.40|443|P.|3719467576|65535|1296|
10:33:12.834085|tcp|10.20.6.40|443|10.20.4.58|52787|P.|3846878146|65535|1722|
10:33:12.834385|tcp|10.20.4.58|52787|10.20.6.40|443|.|3719468872|65535|0|
10:33:12.880593|tcp|10.20.4.58|52787|10.20.6.40|443|P.|3719468872|65535|1072|
10:33:12.886277|tcp|10.20.6.40|443|10.20.4.58|52787|P.|3846879868|65535|1741|
10:33:12.886577|tcp|10.20.4.58|52787|10.20.6.40|443|.|3719469944|65535|0|
10:33:12.897529|tcp|10.20.4.58|52787|10.20.6.40|443|P.|3719469944|65535|1196|
10:33:12.902402|tcp|10.20.6.40|443|10.20.4.58|52787|P.|3846881609|65535|2624|
10:33:12.902702|tcp|10.20.4.58|52787|10.20.6.40|443|.|3719471140|65535|0|
10:33:12.929917|tcp|10.20.4.58|52787|10.20.6.40|443|P.|3719471140|65535|1295|
10:33:12.933316|tcp|10.20.6.40|443|10.20.4.58|52787|P.|3846884233|65535|1204|
10:33:12.933616|tcp|10.20.4.58|52787|10.20.6.40|443|.|3719472435|65535|0|
10:33:12.989446|tcp|10.20.4.58|52787|10.20.6.40|443|P.|3719472435|65535|1179|
10:33:12.991714|tcp|10.20.6.40|443|10.20.4.58|52787|P.|3846885437|65535|1424|
10:33:12.992014|tcp|10.20.4.58|52787|10.20.6.40|443|.|3719473614|65535|0|
10:33:13.040532|tcp|10.20.4.58|52787|10.20.6.40|443|P.|3719473614|65535|1018|
10:33:13.041686|tcp|10.20.6.40|443|10.20.4.58|52787|P.|3846886861|65535|1272|
10:33:13.041986|tcp|10.20.4.58|52787|10.20.6.40|443|.|3719474632|65535|0|
10:33:13.061986|tcp|10.20.4.58|52787|10.20.6.40|443|F.|3719474632|65535|0|
10:33:13.062486|tcp|10.20.6.40|443|10.20.4.58|52787|F.|3846888133|65535|0|
10:33:13.062686|tcp|10.20.4.58|52787|10.20.6.40|443|.|3719474633|65535|0|
10:33:19.187815|udp|10.20.6.40|54500|10.20.1.10|53|q|64777|0|63|64777+ A? rmg-backup-01.ridgelinemed.example.
10:33:19.190816|udp|10.20.1.10|53|10.20.6.40|54500|r|64777|0|79|64777 1/0/0 A 10.20.9.15
10:33:58.587759|udp|10.20.6.40|37166|10.20.1.10|53|q|3792|0|56|3792+ A? portal.ridgelinemed.example.
10:33:58.589951|udp|10.20.1.10|53|10.20.6.40|37166|r|3792|0|72|3792 1/0/0 A 10.20.6.40
10:34:07.000000|tcp|10.20.9.40|46131|10.20.6.40|9100|S|3719930271|29200|0|
10:34:07.000451|tcp|10.20.6.40|9100|10.20.9.40|46131|S.|3028373897|64240|0|
10:34:07.000848|tcp|10.20.9.40|46131|10.20.6.40|9100|.|3719930272|29200|0|
10:34:07.035677|tcp|10.20.9.40|46131|10.20.6.40|9100|P.|3719930272|29200|461|GET /metrics HTTP/1.1
10:34:07.039490|tcp|10.20.6.40|9100|10.20.9.40|46131|P.|3028373898|64240|1612|
10:34:07.039790|tcp|10.20.9.40|46131|10.20.6.40|9100|.|3719930733|29200|0|
10:34:07.059790|tcp|10.20.9.40|46131|10.20.6.40|9100|F.|3719930733|29200|0|
10:34:07.060290|tcp|10.20.6.40|9100|10.20.9.40|46131|F.|3028375510|64240|0|
10:34:07.060490|tcp|10.20.9.40|46131|10.20.6.40|9100|.|3719930734|29200|0|
10:34:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 18
10:34:31.000784|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 18
10:34:32.102518|tcp|10.20.4.12|54785|10.20.6.40|443|S|2232405867|65535|0|
10:34:32.103332|tcp|10.20.6.40|443|10.20.4.12|54785|S.|839719476|65535|0|
10:34:32.103714|tcp|10.20.4.12|54785|10.20.6.40|443|.|2232405868|65535|0|
10:34:32.115743|tcp|10.20.4.12|54785|10.20.6.40|443|P.|2232405868|65535|1323|TLS SNI: portal.ridgelinemed.example
10:34:32.118381|tcp|10.20.6.40|443|10.20.4.12|54785|P.|839719477|65535|882|
10:34:32.118681|tcp|10.20.4.12|54785|10.20.6.40|443|.|2232407191|65535|0|
10:34:32.170841|tcp|10.20.4.12|54785|10.20.6.40|443|P.|2232407191|65535|892|
10:34:32.172189|tcp|10.20.6.40|443|10.20.4.12|54785|P.|839720359|65535|2540|
10:34:32.172489|tcp|10.20.4.12|54785|10.20.6.40|443|.|2232408083|65535|0|
10:34:32.229025|tcp|10.20.4.12|54785|10.20.6.40|443|P.|2232408083|65535|835|
10:34:32.233477|tcp|10.20.6.40|443|10.20.4.12|54785|P.|839722899|65535|1137|
10:34:32.233777|tcp|10.20.4.12|54785|10.20.6.40|443|.|2232408918|65535|0|
10:34:32.253777|tcp|10.20.4.12|54785|10.20.6.40|443|F.|2232408918|65535|0|
10:34:32.254277|tcp|10.20.6.40|443|10.20.4.12|54785|F.|839724036|65535|0|
10:34:32.254477|tcp|10.20.4.12|54785|10.20.6.40|443|.|2232408919|65535|0|
10:34:40.389969|udp|10.20.6.40|50477|10.20.1.10|53|q|6511|0|44|6511+ A? www.example.com.
10:34:40.393166|udp|10.20.1.10|53|10.20.6.40|50477|r|6511|0|60|6511 1/0/0 A 192.0.2.10
10:35:07.000000|tcp|10.20.9.40|45783|10.20.6.40|9100|S|3680312777|29200|0|
10:35:07.000982|tcp|10.20.6.40|9100|10.20.9.40|45783|S.|92689250|65535|0|
10:35:07.001983|tcp|10.20.9.40|45783|10.20.6.40|9100|.|3680312778|29200|0|
10:35:07.057614|tcp|10.20.9.40|45783|10.20.6.40|9100|P.|3680312778|29200|484|GET /metrics HTTP/1.1
10:35:07.063515|tcp|10.20.6.40|9100|10.20.9.40|45783|P.|92689251|65535|910|
10:35:07.063815|tcp|10.20.9.40|45783|10.20.6.40|9100|.|3680313262|29200|0|
10:35:07.083815|tcp|10.20.9.40|45783|10.20.6.40|9100|F.|3680313262|29200|0|
10:35:07.084315|tcp|10.20.6.40|9100|10.20.9.40|45783|F.|92690161|65535|0|
10:35:07.084515|tcp|10.20.9.40|45783|10.20.6.40|9100|.|3680313263|29200|0|
10:35:50.800796|udp|10.20.6.40|58122|10.20.1.10|53|q|11653|0|39|11653+ A? ubuntu.com.
10:35:50.803328|udp|10.20.1.10|53|10.20.6.40|58122|r|11653|0|55|11653 1/0/0 A 192.0.2.30
10:36:07.000000|tcp|10.20.9.40|45951|10.20.6.40|9100|S|1497180864|65535|0|
10:36:07.000463|tcp|10.20.6.40|9100|10.20.9.40|45951|S.|753262356|65535|0|
10:36:07.001565|tcp|10.20.9.40|45951|10.20.6.40|9100|.|1497180865|65535|0|
10:36:07.034596|tcp|10.20.9.40|45951|10.20.6.40|9100|P.|1497180865|65535|681|GET /metrics HTTP/1.1
10:36:07.039190|tcp|10.20.6.40|9100|10.20.9.40|45951|P.|753262357|65535|1436|
10:36:07.039490|tcp|10.20.9.40|45951|10.20.6.40|9100|.|1497181546|65535|0|
10:36:07.059490|tcp|10.20.9.40|45951|10.20.6.40|9100|F.|1497181546|65535|0|
10:36:07.059990|tcp|10.20.6.40|9100|10.20.9.40|45951|F.|753263793|65535|0|
10:36:07.060190|tcp|10.20.9.40|45951|10.20.6.40|9100|.|1497181547|65535|0|
10:36:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 19
10:36:31.000748|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 19
10:36:48.196104|udp|10.20.6.40|34437|10.20.1.10|53|q|47437|0|56|47437+ A? portal.ridgelinemed.example.
10:36:48.199727|udp|10.20.1.10|53|10.20.6.40|34437|r|47437|0|72|47437 1/0/0 A 10.20.6.40
10:37:07.000000|tcp|10.20.9.40|55819|10.20.6.40|9100|S|2046604723|64240|0|
10:37:07.001073|tcp|10.20.6.40|9100|10.20.9.40|55819|S.|2547516585|29200|0|
10:37:07.002106|tcp|10.20.9.40|55819|10.20.6.40|9100|.|2046604724|64240|0|
10:37:07.060927|tcp|10.20.9.40|55819|10.20.6.40|9100|P.|2046604724|64240|865|GET /metrics HTTP/1.1
10:37:07.063812|tcp|10.20.6.40|9100|10.20.9.40|55819|P.|2547516586|29200|1176|
10:37:07.064112|tcp|10.20.9.40|55819|10.20.6.40|9100|.|2046605589|64240|0|
10:37:07.084112|tcp|10.20.9.40|55819|10.20.6.40|9100|F.|2046605589|64240|0|
10:37:07.084612|tcp|10.20.6.40|9100|10.20.9.40|55819|F.|2547517762|29200|0|
10:37:07.084812|tcp|10.20.9.40|55819|10.20.6.40|9100|.|2046605590|64240|0|
10:37:56.072218|udp|10.20.6.40|45826|10.20.1.10|53|q|43333|0|56|43333+ A? portal.ridgelinemed.example.
10:37:56.075799|udp|10.20.1.10|53|10.20.6.40|45826|r|43333|0|72|43333 1/0/0 A 10.20.6.40
10:38:07.000000|tcp|10.20.9.40|50913|10.20.6.40|9100|S|274153598|29200|0|
10:38:07.001183|tcp|10.20.6.40|9100|10.20.9.40|50913|S.|3463639171|29200|0|
10:38:07.002158|tcp|10.20.9.40|50913|10.20.6.40|9100|.|274153599|29200|0|
10:38:07.020879|tcp|10.20.9.40|50913|10.20.6.40|9100|P.|274153599|29200|800|GET /metrics HTTP/1.1
10:38:07.025068|tcp|10.20.6.40|9100|10.20.9.40|50913|P.|3463639172|29200|789|
10:38:07.025368|tcp|10.20.9.40|50913|10.20.6.40|9100|.|274154399|29200|0|
10:38:07.045368|tcp|10.20.9.40|50913|10.20.6.40|9100|F.|274154399|29200|0|
10:38:07.045868|tcp|10.20.6.40|9100|10.20.9.40|50913|F.|3463639961|29200|0|
10:38:07.046068|tcp|10.20.9.40|50913|10.20.6.40|9100|.|274154400|29200|0|
10:38:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 20
10:38:31.000369|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 20
10:38:35.873369|udp|10.20.6.40|58849|10.20.1.10|53|q|18779|0|40|18779+ A? example.com.
10:38:35.876738|udp|10.20.1.10|53|10.20.6.40|58849|r|18779|0|56|18779 1/0/0 A 192.0.2.10
10:39:07.000000|tcp|10.20.9.40|40918|10.20.6.40|9100|S|2349674486|29200|0|
10:39:07.001229|tcp|10.20.6.40|9100|10.20.9.40|40918|S.|2256340815|29200|0|
10:39:07.001493|tcp|10.20.9.40|40918|10.20.6.40|9100|.|2349674487|29200|0|
10:39:07.043126|tcp|10.20.9.40|40918|10.20.6.40|9100|P.|2349674487|29200|626|GET /metrics HTTP/1.1
10:39:07.047756|tcp|10.20.6.40|9100|10.20.9.40|40918|P.|2256340816|29200|515|
10:39:07.048056|tcp|10.20.9.40|40918|10.20.6.40|9100|.|2349675113|29200|0|
10:39:07.068056|tcp|10.20.9.40|40918|10.20.6.40|9100|F.|2349675113|29200|0|
10:39:07.068556|tcp|10.20.6.40|9100|10.20.9.40|40918|F.|2256341331|29200|0|
10:39:07.068756|tcp|10.20.9.40|40918|10.20.6.40|9100|.|2349675114|29200|0|
10:39:24.577411|udp|10.20.6.40|59506|10.20.1.10|53|q|27997|0|39|27997+ A? ubuntu.com.
10:39:24.581091|udp|10.20.1.10|53|10.20.6.40|59506|r|27997|0|55|27997 1/0/0 A 192.0.2.30
10:40:07.000000|tcp|10.20.9.40|60350|10.20.6.40|9100|S|3281790153|65535|0|
10:40:07.001386|tcp|10.20.6.40|9100|10.20.9.40|60350|S.|1088490856|64240|0|
10:40:07.002088|tcp|10.20.9.40|60350|10.20.6.40|9100|.|3281790154|65535|0|
10:40:07.060925|tcp|10.20.9.40|60350|10.20.6.40|9100|P.|3281790154|65535|862|GET /metrics HTTP/1.1
10:40:07.063377|tcp|10.20.6.40|9100|10.20.9.40|60350|P.|1088490857|64240|731|
10:40:07.063677|tcp|10.20.9.40|60350|10.20.6.40|9100|.|3281791016|65535|0|
10:40:07.083677|tcp|10.20.9.40|60350|10.20.6.40|9100|F.|3281791016|65535|0|
10:40:07.084177|tcp|10.20.6.40|9100|10.20.9.40|60350|F.|1088491588|64240|0|
10:40:07.084377|tcp|10.20.9.40|60350|10.20.6.40|9100|.|3281791017|65535|0|
10:40:11.607917|tcp|10.20.6.40|46319|192.0.2.30|443|S|1671373182|29200|0|
10:40:11.608452|tcp|192.0.2.30|443|10.20.6.40|46319|S.|495121816|29200|0|
10:40:11.609449|tcp|10.20.6.40|46319|192.0.2.30|443|.|1671373183|29200|0|
10:40:11.622263|tcp|10.20.6.40|46319|192.0.2.30|443|P.|1671373183|29200|1123|TLS SNI: packages.example.org
10:40:11.624169|tcp|192.0.2.30|443|10.20.6.40|46319|P.|495121817|29200|2253|
10:40:11.624469|tcp|10.20.6.40|46319|192.0.2.30|443|.|1671374306|29200|0|
10:40:11.647336|tcp|10.20.6.40|46319|192.0.2.30|443|P.|1671374306|29200|750|
10:40:11.648607|tcp|192.0.2.30|443|10.20.6.40|46319|P.|495124070|29200|1385|
10:40:11.648907|tcp|10.20.6.40|46319|192.0.2.30|443|.|1671375056|29200|0|
10:40:11.668907|tcp|10.20.6.40|46319|192.0.2.30|443|F.|1671375056|29200|0|
10:40:11.669407|tcp|192.0.2.30|443|10.20.6.40|46319|F.|495125455|29200|0|
10:40:11.669607|tcp|10.20.6.40|46319|192.0.2.30|443|.|1671375057|29200|0|
10:40:19.642048|udp|10.20.6.40|41733|10.20.1.10|53|q|36237|0|44|36237+ A? www.example.com.
10:40:19.645170|udp|10.20.1.10|53|10.20.6.40|41733|r|36237|0|60|36237 1/0/0 A 192.0.2.10
10:40:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 21
10:40:31.000749|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 21
10:41:07.000000|tcp|10.20.9.40|42975|10.20.6.40|9100|S|1189449951|65535|0|
10:41:07.000631|tcp|10.20.6.40|9100|10.20.9.40|42975|S.|736068732|65535|0|
10:41:07.000950|tcp|10.20.9.40|42975|10.20.6.40|9100|.|1189449952|65535|0|
10:41:07.046750|tcp|10.20.9.40|42975|10.20.6.40|9100|P.|1189449952|65535|579|GET /metrics HTTP/1.1
10:41:07.048210|tcp|10.20.6.40|9100|10.20.9.40|42975|P.|736068733|65535|1633|
10:41:07.048510|tcp|10.20.9.40|42975|10.20.6.40|9100|.|1189450531|65535|0|
10:41:07.068510|tcp|10.20.9.40|42975|10.20.6.40|9100|F.|1189450531|65535|0|
10:41:07.069010|tcp|10.20.6.40|9100|10.20.9.40|42975|F.|736070366|65535|0|
10:41:07.069210|tcp|10.20.9.40|42975|10.20.6.40|9100|.|1189450532|65535|0|
10:41:29.217984|udp|10.20.6.40|38974|10.20.1.10|53|q|64093|0|39|64093+ A? ubuntu.com.
10:41:29.220583|udp|10.20.1.10|53|10.20.6.40|38974|r|64093|0|55|64093 1/0/0 A 192.0.2.30
10:41:40.432631|tcp|10.20.6.40|58839|192.0.2.20|443|S|1299570237|65535|0|
10:41:40.433513|tcp|192.0.2.20|443|10.20.6.40|58839|S.|3726067471|62720|0|
10:41:40.433925|tcp|10.20.6.40|58839|192.0.2.20|443|.|1299570238|65535|0|
10:41:40.481681|tcp|10.20.6.40|58839|192.0.2.20|443|P.|1299570238|65535|979|TLS SNI: search.example.net
10:41:40.486914|tcp|192.0.2.20|443|10.20.6.40|58839|P.|3726067472|62720|1143|
10:41:40.487214|tcp|10.20.6.40|58839|192.0.2.20|443|.|1299571217|65535|0|
10:41:40.526710|tcp|10.20.6.40|58839|192.0.2.20|443|P.|1299571217|65535|758|
10:41:40.530102|tcp|192.0.2.20|443|10.20.6.40|58839|P.|3726068615|62720|1566|
10:41:40.530402|tcp|10.20.6.40|58839|192.0.2.20|443|.|1299571975|65535|0|
10:41:40.560048|tcp|10.20.6.40|58839|192.0.2.20|443|P.|1299571975|65535|1018|
10:41:40.564195|tcp|192.0.2.20|443|10.20.6.40|58839|P.|3726070181|62720|1899|
10:41:40.564495|tcp|10.20.6.40|58839|192.0.2.20|443|.|1299572993|65535|0|
10:41:40.584495|tcp|10.20.6.40|58839|192.0.2.20|443|F.|1299572993|65535|0|
10:41:40.584995|tcp|192.0.2.20|443|10.20.6.40|58839|F.|3726072080|62720|0|
10:41:40.585195|tcp|10.20.6.40|58839|192.0.2.20|443|.|1299572994|65535|0|
10:42:07.000000|tcp|10.20.9.40|52378|10.20.6.40|9100|S|989165367|62720|0|
10:42:07.000599|tcp|10.20.6.40|9100|10.20.9.40|52378|S.|1243748636|62720|0|
10:42:07.001797|tcp|10.20.9.40|52378|10.20.6.40|9100|.|989165368|62720|0|
10:42:07.015065|tcp|10.20.9.40|52378|10.20.6.40|9100|P.|989165368|62720|711|GET /metrics HTTP/1.1
10:42:07.020834|tcp|10.20.6.40|9100|10.20.9.40|52378|P.|1243748637|62720|735|
10:42:07.021134|tcp|10.20.9.40|52378|10.20.6.40|9100|.|989166079|62720|0|
10:42:07.041134|tcp|10.20.9.40|52378|10.20.6.40|9100|F.|989166079|62720|0|
10:42:07.041634|tcp|10.20.6.40|9100|10.20.9.40|52378|F.|1243749372|62720|0|
10:42:07.041834|tcp|10.20.9.40|52378|10.20.6.40|9100|.|989166080|62720|0|
10:42:29.808277|udp|10.20.6.40|32887|10.20.1.10|53|q|9969|0|39|9969+ A? ubuntu.com.
10:42:29.811617|udp|10.20.1.10|53|10.20.6.40|32887|r|9969|0|55|9969 1/0/0 A 192.0.2.30
10:42:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 22
10:42:31.000643|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 22
10:43:07.000000|tcp|10.20.9.40|46653|10.20.6.40|9100|S|37146334|29200|0|
10:43:07.000567|tcp|10.20.6.40|9100|10.20.9.40|46653|S.|376887081|65535|0|
10:43:07.001227|tcp|10.20.9.40|46653|10.20.6.40|9100|.|37146335|29200|0|
10:43:07.011685|tcp|10.20.9.40|46653|10.20.6.40|9100|P.|37146335|29200|710|GET /metrics HTTP/1.1
10:43:07.014226|tcp|10.20.6.40|9100|10.20.9.40|46653|P.|376887082|65535|1234|
10:43:07.014526|tcp|10.20.9.40|46653|10.20.6.40|9100|.|37147045|29200|0|
10:43:07.034526|tcp|10.20.9.40|46653|10.20.6.40|9100|F.|37147045|29200|0|
10:43:07.035026|tcp|10.20.6.40|9100|10.20.9.40|46653|F.|376888316|65535|0|
10:43:07.035226|tcp|10.20.9.40|46653|10.20.6.40|9100|.|37147046|29200|0|
10:43:20.151925|udp|10.20.6.40|52633|10.20.1.10|53|q|7984|0|44|7984+ A? www.example.com.
10:43:20.155736|udp|10.20.1.10|53|10.20.6.40|52633|r|7984|0|60|7984 1/0/0 A 192.0.2.10
10:44:07.000000|tcp|10.20.9.40|34747|10.20.6.40|9100|S|2245105174|29200|0|
10:44:07.001037|tcp|10.20.6.40|9100|10.20.9.40|34747|S.|534264875|62720|0|
10:44:07.001878|tcp|10.20.9.40|34747|10.20.6.40|9100|.|2245105175|29200|0|
10:44:07.014609|tcp|10.20.9.40|34747|10.20.6.40|9100|P.|2245105175|29200|757|GET /metrics HTTP/1.1
10:44:07.020562|tcp|10.20.6.40|9100|10.20.9.40|34747|P.|534264876|62720|982|
10:44:07.020862|tcp|10.20.9.40|34747|10.20.6.40|9100|.|2245105932|29200|0|
10:44:07.040862|tcp|10.20.9.40|34747|10.20.6.40|9100|F.|2245105932|29200|0|
10:44:07.041362|tcp|10.20.6.40|9100|10.20.9.40|34747|F.|534265858|62720|0|
10:44:07.041562|tcp|10.20.9.40|34747|10.20.6.40|9100|.|2245105933|29200|0|
10:44:08.034391|udp|10.20.6.40|56741|10.20.1.10|53|q|63008|0|40|63008+ A? example.com.
10:44:08.037176|udp|10.20.1.10|53|10.20.6.40|56741|r|63008|0|56|63008 1/0/0 A 192.0.2.10
10:44:28.007060|tcp|192.0.2.9|59036|10.20.6.40|3306|S|2145906053|29200|0|
10:44:28.007273|tcp|10.20.6.40|3306|192.0.2.9|59036|R.|0|0|0|
10:44:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 23
10:44:31.000450|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 23
10:44:35.350589|tcp|192.0.2.9|59413|10.20.6.40|21|S|3222676836|62720|0|
10:44:35.351083|tcp|10.20.6.40|21|192.0.2.9|59413|R.|0|0|0|
10:44:41.484375|tcp|192.0.2.9|39972|10.20.6.40|110|S|2388847883|65535|0|
10:44:41.484750|tcp|10.20.6.40|110|192.0.2.9|39972|R.|0|0|0|
10:44:42.656708|tcp|192.0.2.9|43924|10.20.6.40|135|S|2700443702|65535|0|
10:44:42.657049|tcp|10.20.6.40|135|192.0.2.9|43924|R.|0|0|0|
10:44:45.953256|tcp|192.0.2.9|43999|10.20.6.40|23|S|3676589383|62720|0|
10:44:45.953607|tcp|10.20.6.40|23|192.0.2.9|43999|R.|0|0|0|
10:44:54.550142|tcp|192.0.2.9|34422|10.20.6.40|8080|S|3145061134|62720|0|
10:44:54.550440|tcp|10.20.6.40|8080|192.0.2.9|34422|R.|0|0|0|
10:44:55.369146|tcp|192.0.2.9|34933|10.20.6.40|3389|S|2321739648|29200|0|
10:44:55.369564|tcp|10.20.6.40|3389|192.0.2.9|34933|R.|0|0|0|
10:44:57.109865|udp|10.20.6.40|52018|10.20.1.10|53|q|58590|0|63|58590+ A? rmg-backup-01.ridgelinemed.example.
10:44:57.113551|udp|10.20.1.10|53|10.20.6.40|52018|r|58590|0|79|58590 1/0/0 A 10.20.9.15
10:45:07.000000|tcp|10.20.9.40|36461|10.20.6.40|9100|S|3376428162|29200|0|
10:45:07.000808|tcp|10.20.6.40|9100|10.20.9.40|36461|S.|267131305|62720|0|
10:45:07.001374|tcp|10.20.9.40|36461|10.20.6.40|9100|.|3376428163|29200|0|
10:45:07.019827|tcp|10.20.9.40|36461|10.20.6.40|9100|P.|3376428163|29200|634|GET /metrics HTTP/1.1
10:45:07.024677|tcp|10.20.6.40|9100|10.20.9.40|36461|P.|267131306|62720|1609|
10:45:07.024977|tcp|10.20.9.40|36461|10.20.6.40|9100|.|3376428797|29200|0|
10:45:07.044977|tcp|10.20.9.40|36461|10.20.6.40|9100|F.|3376428797|29200|0|
10:45:07.045477|tcp|10.20.6.40|9100|10.20.9.40|36461|F.|267132915|62720|0|
10:45:07.045677|tcp|10.20.9.40|36461|10.20.6.40|9100|.|3376428798|29200|0|
10:46:05.448909|udp|10.20.6.40|37297|10.20.1.10|53|q|47404|0|40|47404+ A? example.com.
10:46:05.451560|udp|10.20.1.10|53|10.20.6.40|37297|r|47404|0|56|47404 1/0/0 A 192.0.2.10
10:46:07.000000|tcp|10.20.9.40|56838|10.20.6.40|9100|S|3959013308|65535|0|
10:46:07.001399|tcp|10.20.6.40|9100|10.20.9.40|56838|S.|263906496|64240|0|
10:46:07.002173|tcp|10.20.9.40|56838|10.20.6.40|9100|.|3959013309|65535|0|
10:46:07.055956|tcp|10.20.9.40|56838|10.20.6.40|9100|P.|3959013309|65535|595|GET /metrics HTTP/1.1
10:46:07.058493|tcp|10.20.6.40|9100|10.20.9.40|56838|P.|263906497|64240|1105|
10:46:07.058793|tcp|10.20.9.40|56838|10.20.6.40|9100|.|3959013904|65535|0|
10:46:07.078793|tcp|10.20.9.40|56838|10.20.6.40|9100|F.|3959013904|65535|0|
10:46:07.079293|tcp|10.20.6.40|9100|10.20.9.40|56838|F.|263907602|64240|0|
10:46:07.079493|tcp|10.20.9.40|56838|10.20.6.40|9100|.|3959013905|65535|0|
10:46:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 24
10:46:31.000733|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 24
10:47:00.391508|tcp|203.0.113.55|58035|10.20.6.40|22|S|3455685580|65535|0|
10:47:00.392495|tcp|10.20.6.40|22|203.0.113.55|58035|S.|1687647747|64240|0|
10:47:00.393379|tcp|203.0.113.55|58035|10.20.6.40|22|.|3455685581|65535|0|
10:47:00.420809|tcp|203.0.113.55|58035|10.20.6.40|22|P.|3455685581|65535|247|SSH-2.0-libssh2_1.10.0
10:47:00.425866|tcp|10.20.6.40|22|203.0.113.55|58035|P.|1687647748|64240|461|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:47:00.426166|tcp|203.0.113.55|58035|10.20.6.40|22|.|3455685828|65535|0|
10:47:00.464363|tcp|203.0.113.55|58035|10.20.6.40|22|P.|3455685828|65535|300|
10:47:00.465905|tcp|10.20.6.40|22|203.0.113.55|58035|P.|1687648209|64240|439|
10:47:00.466205|tcp|203.0.113.55|58035|10.20.6.40|22|.|3455686128|65535|0|
10:47:00.486205|tcp|203.0.113.55|58035|10.20.6.40|22|F.|3455686128|65535|0|
10:47:00.486705|tcp|10.20.6.40|22|203.0.113.55|58035|F.|1687648648|64240|0|
10:47:00.486905|tcp|203.0.113.55|58035|10.20.6.40|22|.|3455686129|65535|0|
10:47:07.000000|tcp|10.20.9.40|56144|10.20.6.40|9100|S|663672586|64240|0|
10:47:07.001142|tcp|10.20.6.40|9100|10.20.9.40|56144|S.|2519242425|62720|0|
10:47:07.001672|tcp|10.20.9.40|56144|10.20.6.40|9100|.|663672587|64240|0|
10:47:07.051494|tcp|10.20.9.40|56144|10.20.6.40|9100|P.|663672587|64240|819|GET /metrics HTTP/1.1
10:47:07.057077|tcp|10.20.6.40|9100|10.20.9.40|56144|P.|2519242426|62720|739|
10:47:07.057377|tcp|10.20.9.40|56144|10.20.6.40|9100|.|663673406|64240|0|
10:47:07.077377|tcp|10.20.9.40|56144|10.20.6.40|9100|F.|663673406|64240|0|
10:47:07.077877|tcp|10.20.6.40|9100|10.20.9.40|56144|F.|2519243165|62720|0|
10:47:07.078077|tcp|10.20.9.40|56144|10.20.6.40|9100|.|663673407|64240|0|
10:47:13.325324|udp|10.20.6.40|60630|10.20.1.10|53|q|46619|0|64|46619+ A? rmg-monitor-01.ridgelinemed.example.
10:47:13.328910|udp|10.20.1.10|53|10.20.6.40|60630|r|46619|0|80|46619 1/0/0 A 10.20.9.40
10:47:13.932326|tcp|203.0.113.55|53170|10.20.6.40|22|S|1145839532|29200|0|
10:47:13.933668|tcp|10.20.6.40|22|203.0.113.55|53170|S.|261886448|62720|0|
10:47:13.934313|tcp|203.0.113.55|53170|10.20.6.40|22|.|1145839533|29200|0|
10:47:13.951511|tcp|203.0.113.55|53170|10.20.6.40|22|P.|1145839533|29200|189|SSH-2.0-libssh2_1.10.0
10:47:13.952895|tcp|10.20.6.40|22|203.0.113.55|53170|P.|261886449|62720|346|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:47:13.953195|tcp|203.0.113.55|53170|10.20.6.40|22|.|1145839722|29200|0|
10:47:13.963979|tcp|203.0.113.55|53170|10.20.6.40|22|P.|1145839722|29200|258|
10:47:13.967709|tcp|10.20.6.40|22|203.0.113.55|53170|P.|261886795|62720|201|
10:47:13.968009|tcp|203.0.113.55|53170|10.20.6.40|22|.|1145839980|29200|0|
10:47:13.988009|tcp|203.0.113.55|53170|10.20.6.40|22|F.|1145839980|29200|0|
10:47:13.988509|tcp|10.20.6.40|22|203.0.113.55|53170|F.|261886996|62720|0|
10:47:13.988709|tcp|203.0.113.55|53170|10.20.6.40|22|.|1145839981|29200|0|
10:47:24.590954|tcp|203.0.113.55|46537|10.20.6.40|22|S|741309882|65535|0|
10:47:24.591495|tcp|10.20.6.40|22|203.0.113.55|46537|S.|2624605646|65535|0|
10:47:24.592003|tcp|203.0.113.55|46537|10.20.6.40|22|.|741309883|65535|0|
10:47:24.614544|tcp|203.0.113.55|46537|10.20.6.40|22|P.|741309883|65535|241|SSH-2.0-libssh2_1.10.0
10:47:24.615764|tcp|10.20.6.40|22|203.0.113.55|46537|P.|2624605647|65535|424|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:47:24.616064|tcp|203.0.113.55|46537|10.20.6.40|22|.|741310124|65535|0|
10:47:24.644701|tcp|203.0.113.55|46537|10.20.6.40|22|P.|741310124|65535|201|
10:47:24.649581|tcp|10.20.6.40|22|203.0.113.55|46537|P.|2624606071|65535|318|
10:47:24.649881|tcp|203.0.113.55|46537|10.20.6.40|22|.|741310325|65535|0|
10:47:24.669881|tcp|203.0.113.55|46537|10.20.6.40|22|F.|741310325|65535|0|
10:47:24.670381|tcp|10.20.6.40|22|203.0.113.55|46537|F.|2624606389|65535|0|
10:47:24.670581|tcp|203.0.113.55|46537|10.20.6.40|22|.|741310326|65535|0|
10:47:28.310445|tcp|203.0.113.55|41375|10.20.6.40|22|S|3832883061|62720|0|
10:47:28.311716|tcp|10.20.6.40|22|203.0.113.55|41375|S.|2890283986|65535|0|
10:47:28.312903|tcp|203.0.113.55|41375|10.20.6.40|22|.|3832883062|62720|0|
10:47:28.360918|tcp|203.0.113.55|41375|10.20.6.40|22|P.|3832883062|62720|290|SSH-2.0-libssh2_1.10.0
10:47:28.362515|tcp|10.20.6.40|22|203.0.113.55|41375|P.|2890283987|65535|298|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:47:28.362815|tcp|203.0.113.55|41375|10.20.6.40|22|.|3832883352|62720|0|
10:47:28.383080|tcp|203.0.113.55|41375|10.20.6.40|22|P.|3832883352|62720|163|
10:47:28.385875|tcp|10.20.6.40|22|203.0.113.55|41375|P.|2890284285|65535|185|
10:47:28.386175|tcp|203.0.113.55|41375|10.20.6.40|22|.|3832883515|62720|0|
10:47:28.406175|tcp|203.0.113.55|41375|10.20.6.40|22|F.|3832883515|62720|0|
10:47:28.406675|tcp|10.20.6.40|22|203.0.113.55|41375|F.|2890284470|65535|0|
10:47:28.406875|tcp|203.0.113.55|41375|10.20.6.40|22|.|3832883516|62720|0|
10:47:48.363665|udp|10.20.6.40|56074|10.20.1.10|53|q|63532|0|64|63532+ A? rmg-monitor-01.ridgelinemed.example.
10:47:48.367060|udp|10.20.1.10|53|10.20.6.40|56074|r|63532|0|80|63532 1/0/0 A 10.20.9.40
10:47:48.483548|tcp|203.0.113.55|37727|10.20.6.40|22|S|1997693133|29200|0|
10:47:48.484103|tcp|10.20.6.40|22|203.0.113.55|37727|S.|2365528737|65535|0|
10:47:48.484400|tcp|203.0.113.55|37727|10.20.6.40|22|.|1997693134|29200|0|
10:47:48.514992|tcp|203.0.113.55|37727|10.20.6.40|22|P.|1997693134|29200|257|SSH-2.0-libssh2_1.10.0
10:47:48.518640|tcp|10.20.6.40|22|203.0.113.55|37727|P.|2365528738|65535|321|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:47:48.518940|tcp|203.0.113.55|37727|10.20.6.40|22|.|1997693391|29200|0|
10:47:48.573215|tcp|203.0.113.55|37727|10.20.6.40|22|P.|1997693391|29200|188|
10:47:48.576583|tcp|10.20.6.40|22|203.0.113.55|37727|P.|2365529059|65535|239|
10:47:48.576883|tcp|203.0.113.55|37727|10.20.6.40|22|.|1997693579|29200|0|
10:47:48.596883|tcp|203.0.113.55|37727|10.20.6.40|22|F.|1997693579|29200|0|
10:47:48.597383|tcp|10.20.6.40|22|203.0.113.55|37727|F.|2365529298|65535|0|
10:47:48.597583|tcp|203.0.113.55|37727|10.20.6.40|22|.|1997693580|29200|0|
10:47:56.303253|tcp|203.0.113.55|52228|10.20.6.40|22|S|3439385237|64240|0|
10:47:56.304394|tcp|10.20.6.40|22|203.0.113.55|52228|S.|163741403|65535|0|
10:47:56.305005|tcp|203.0.113.55|52228|10.20.6.40|22|.|3439385238|64240|0|
10:47:56.334808|tcp|203.0.113.55|52228|10.20.6.40|22|P.|3439385238|64240|291|SSH-2.0-libssh2_1.10.0
10:47:56.340661|tcp|10.20.6.40|22|203.0.113.55|52228|P.|163741404|65535|195|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:47:56.340961|tcp|203.0.113.55|52228|10.20.6.40|22|.|3439385529|64240|0|
10:47:56.394299|tcp|203.0.113.55|52228|10.20.6.40|22|P.|3439385529|64240|253|
10:47:56.399698|tcp|10.20.6.40|22|203.0.113.55|52228|P.|163741599|65535|203|
10:47:56.399998|tcp|203.0.113.55|52228|10.20.6.40|22|.|3439385782|64240|0|
10:47:56.419998|tcp|203.0.113.55|52228|10.20.6.40|22|F.|3439385782|64240|0|
10:47:56.420498|tcp|10.20.6.40|22|203.0.113.55|52228|F.|163741802|65535|0|
10:47:56.420698|tcp|203.0.113.55|52228|10.20.6.40|22|.|3439385783|64240|0|
10:48:00.964919|tcp|203.0.113.55|41058|10.20.6.40|22|S|264398426|62720|0|
10:48:00.965710|tcp|10.20.6.40|22|203.0.113.55|41058|S.|3529062478|29200|0|
10:48:00.966750|tcp|203.0.113.55|41058|10.20.6.40|22|.|264398427|62720|0|
10:48:00.978293|tcp|203.0.113.55|41058|10.20.6.40|22|P.|264398427|62720|196|SSH-2.0-libssh2_1.10.0
10:48:00.981072|tcp|10.20.6.40|22|203.0.113.55|41058|P.|3529062479|29200|153|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:48:00.981372|tcp|203.0.113.55|41058|10.20.6.40|22|.|264398623|62720|0|
10:48:01.034345|tcp|203.0.113.55|41058|10.20.6.40|22|P.|264398623|62720|220|
10:48:01.035682|tcp|10.20.6.40|22|203.0.113.55|41058|P.|3529062632|29200|487|
10:48:01.035982|tcp|203.0.113.55|41058|10.20.6.40|22|.|264398843|62720|0|
10:48:01.055982|tcp|203.0.113.55|41058|10.20.6.40|22|F.|264398843|62720|0|
10:48:01.056482|tcp|10.20.6.40|22|203.0.113.55|41058|F.|3529063119|29200|0|
10:48:01.056682|tcp|203.0.113.55|41058|10.20.6.40|22|.|264398844|62720|0|
10:48:04.575266|tcp|203.0.113.55|38963|10.20.6.40|22|S|3712284301|29200|0|
10:48:04.576227|tcp|10.20.6.40|22|203.0.113.55|38963|S.|2499284870|29200|0|
10:48:04.576845|tcp|203.0.113.55|38963|10.20.6.40|22|.|3712284302|29200|0|
10:48:04.610859|tcp|203.0.113.55|38963|10.20.6.40|22|P.|3712284302|29200|215|SSH-2.0-libssh2_1.10.0
10:48:04.612756|tcp|10.20.6.40|22|203.0.113.55|38963|P.|2499284871|29200|150|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:48:04.613056|tcp|203.0.113.55|38963|10.20.6.40|22|.|3712284517|29200|0|
10:48:04.646879|tcp|203.0.113.55|38963|10.20.6.40|22|P.|3712284517|29200|203|
10:48:04.648389|tcp|10.20.6.40|22|203.0.113.55|38963|P.|2499285021|29200|429|
10:48:04.648689|tcp|203.0.113.55|38963|10.20.6.40|22|.|3712284720|29200|0|
10:48:04.668689|tcp|203.0.113.55|38963|10.20.6.40|22|F.|3712284720|29200|0|
10:48:04.669189|tcp|10.20.6.40|22|203.0.113.55|38963|F.|2499285450|29200|0|
10:48:04.669389|tcp|203.0.113.55|38963|10.20.6.40|22|.|3712284721|29200|0|
10:48:07.000000|tcp|10.20.9.40|35776|10.20.6.40|9100|S|3672646272|64240|0|
10:48:07.000483|tcp|10.20.6.40|9100|10.20.9.40|35776|S.|885857239|64240|0|
10:48:07.001290|tcp|10.20.9.40|35776|10.20.6.40|9100|.|3672646273|64240|0|
10:48:07.043560|tcp|10.20.9.40|35776|10.20.6.40|9100|P.|3672646273|64240|775|GET /metrics HTTP/1.1
10:48:07.044635|tcp|10.20.6.40|9100|10.20.9.40|35776|P.|885857240|64240|1682|
10:48:07.044935|tcp|10.20.9.40|35776|10.20.6.40|9100|.|3672647048|64240|0|
10:48:07.064935|tcp|10.20.9.40|35776|10.20.6.40|9100|F.|3672647048|64240|0|
10:48:07.065435|tcp|10.20.6.40|9100|10.20.9.40|35776|F.|885858922|64240|0|
10:48:07.065635|tcp|10.20.9.40|35776|10.20.6.40|9100|.|3672647049|64240|0|
10:48:24.208616|tcp|203.0.113.55|44721|10.20.6.40|22|S|2055450100|62720|0|
10:48:24.209197|tcp|10.20.6.40|22|203.0.113.55|44721|S.|2423828667|64240|0|
10:48:24.209960|tcp|203.0.113.55|44721|10.20.6.40|22|.|2055450101|62720|0|
10:48:24.224277|tcp|203.0.113.55|44721|10.20.6.40|22|P.|2055450101|62720|153|SSH-2.0-libssh2_1.10.0
10:48:24.228073|tcp|10.20.6.40|22|203.0.113.55|44721|P.|2423828668|64240|170|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:48:24.228373|tcp|203.0.113.55|44721|10.20.6.40|22|.|2055450254|62720|0|
10:48:24.249356|tcp|203.0.113.55|44721|10.20.6.40|22|P.|2055450254|62720|220|
10:48:24.253535|tcp|10.20.6.40|22|203.0.113.55|44721|P.|2423828838|64240|457|
10:48:24.253835|tcp|203.0.113.55|44721|10.20.6.40|22|.|2055450474|62720|0|
10:48:24.273835|tcp|203.0.113.55|44721|10.20.6.40|22|F.|2055450474|62720|0|
10:48:24.274335|tcp|10.20.6.40|22|203.0.113.55|44721|F.|2423829295|64240|0|
10:48:24.274535|tcp|203.0.113.55|44721|10.20.6.40|22|.|2055450475|62720|0|
10:48:28.657282|tcp|203.0.113.55|34529|10.20.6.40|22|S|1123605585|62720|0|
10:48:28.657779|tcp|10.20.6.40|22|203.0.113.55|34529|S.|620291822|29200|0|
10:48:28.658613|tcp|203.0.113.55|34529|10.20.6.40|22|.|1123605586|62720|0|
10:48:28.703621|tcp|203.0.113.55|34529|10.20.6.40|22|P.|1123605586|62720|213|SSH-2.0-libssh2_1.10.0
10:48:28.707471|tcp|10.20.6.40|22|203.0.113.55|34529|P.|620291823|29200|417|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:48:28.707771|tcp|203.0.113.55|34529|10.20.6.40|22|.|1123605799|62720|0|
10:48:28.740244|tcp|203.0.113.55|34529|10.20.6.40|22|P.|1123605799|62720|182|
10:48:28.741851|tcp|10.20.6.40|22|203.0.113.55|34529|P.|620292240|29200|444|
10:48:28.742151|tcp|203.0.113.55|34529|10.20.6.40|22|.|1123605981|62720|0|
10:48:28.762151|tcp|203.0.113.55|34529|10.20.6.40|22|F.|1123605981|62720|0|
10:48:28.762651|tcp|10.20.6.40|22|203.0.113.55|34529|F.|620292684|29200|0|
10:48:28.762851|tcp|203.0.113.55|34529|10.20.6.40|22|.|1123605982|62720|0|
10:48:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 25
10:48:31.000663|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 25
10:48:36.382442|tcp|203.0.113.55|35148|10.20.6.40|22|S|1676013310|62720|0|
10:48:36.383398|tcp|10.20.6.40|22|203.0.113.55|35148|S.|1157930133|62720|0|
10:48:36.384227|tcp|203.0.113.55|35148|10.20.6.40|22|.|1676013311|62720|0|
10:48:36.414997|tcp|203.0.113.55|35148|10.20.6.40|22|P.|1676013311|62720|208|SSH-2.0-libssh2_1.10.0
10:48:36.418709|tcp|10.20.6.40|22|203.0.113.55|35148|P.|1157930134|62720|382|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:48:36.419009|tcp|203.0.113.55|35148|10.20.6.40|22|.|1676013519|62720|0|
10:48:36.476036|tcp|203.0.113.55|35148|10.20.6.40|22|P.|1676013519|62720|233|
10:48:36.481642|tcp|10.20.6.40|22|203.0.113.55|35148|P.|1157930516|62720|186|
10:48:36.481942|tcp|203.0.113.55|35148|10.20.6.40|22|.|1676013752|62720|0|
10:48:36.501942|tcp|203.0.113.55|35148|10.20.6.40|22|F.|1676013752|62720|0|
10:48:36.502442|tcp|10.20.6.40|22|203.0.113.55|35148|F.|1157930702|62720|0|
10:48:36.502642|tcp|203.0.113.55|35148|10.20.6.40|22|.|1676013753|62720|0|
10:48:40.206389|tcp|203.0.113.55|60203|10.20.6.40|22|S|919907062|64240|0|
10:48:40.207465|tcp|10.20.6.40|22|203.0.113.55|60203|S.|1581514846|29200|0|
10:48:40.207689|tcp|203.0.113.55|60203|10.20.6.40|22|.|919907063|64240|0|
10:48:40.227157|tcp|203.0.113.55|60203|10.20.6.40|22|P.|919907063|64240|230|SSH-2.0-libssh2_1.10.0
10:48:40.232168|tcp|10.20.6.40|22|203.0.113.55|60203|P.|1581514847|29200|537|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:48:40.232468|tcp|203.0.113.55|60203|10.20.6.40|22|.|919907293|64240|0|
10:48:40.253159|tcp|203.0.113.55|60203|10.20.6.40|22|P.|919907293|64240|160|
10:48:40.255646|tcp|10.20.6.40|22|203.0.113.55|60203|P.|1581515384|29200|169|
10:48:40.255946|tcp|203.0.113.55|60203|10.20.6.40|22|.|919907453|64240|0|
10:48:40.275946|tcp|203.0.113.55|60203|10.20.6.40|22|F.|919907453|64240|0|
10:48:40.276446|tcp|10.20.6.40|22|203.0.113.55|60203|F.|1581515553|29200|0|
10:48:40.276646|tcp|203.0.113.55|60203|10.20.6.40|22|.|919907454|64240|0|
10:48:40.276736|udp|10.20.6.40|58045|10.20.1.10|53|q|17672|0|40|17672+ A? example.com.
10:48:40.278745|udp|10.20.1.10|53|10.20.6.40|58045|r|17672|0|56|17672 1/0/0 A 192.0.2.10
10:48:48.751744|tcp|203.0.113.55|59131|10.20.6.40|22|S|2939603892|62720|0|
10:48:48.752684|tcp|10.20.6.40|22|203.0.113.55|59131|S.|2981266953|65535|0|
10:48:48.753135|tcp|203.0.113.55|59131|10.20.6.40|22|.|2939603893|62720|0|
10:48:48.798806|tcp|203.0.113.55|59131|10.20.6.40|22|P.|2939603893|62720|244|SSH-2.0-libssh2_1.10.0
10:48:48.803447|tcp|10.20.6.40|22|203.0.113.55|59131|P.|2981266954|65535|152|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:48:48.803747|tcp|203.0.113.55|59131|10.20.6.40|22|.|2939604137|62720|0|
10:48:48.816837|tcp|203.0.113.55|59131|10.20.6.40|22|P.|2939604137|62720|184|
10:48:48.821936|tcp|10.20.6.40|22|203.0.113.55|59131|P.|2981267106|65535|258|
10:48:48.822236|tcp|203.0.113.55|59131|10.20.6.40|22|.|2939604321|62720|0|
10:48:48.842236|tcp|203.0.113.55|59131|10.20.6.40|22|F.|2939604321|62720|0|
10:48:48.842736|tcp|10.20.6.40|22|203.0.113.55|59131|F.|2981267364|65535|0|
10:48:48.842936|tcp|203.0.113.55|59131|10.20.6.40|22|.|2939604322|62720|0|
10:48:52.320927|tcp|203.0.113.55|58572|10.20.6.40|22|S|3527122070|65535|0|
10:48:52.321330|tcp|10.20.6.40|22|203.0.113.55|58572|S.|1413963868|65535|0|
10:48:52.322499|tcp|203.0.113.55|58572|10.20.6.40|22|.|3527122071|65535|0|
10:48:52.372719|tcp|203.0.113.55|58572|10.20.6.40|22|P.|3527122071|65535|238|SSH-2.0-libssh2_1.10.0
10:48:52.378549|tcp|10.20.6.40|22|203.0.113.55|58572|P.|1413963869|65535|244|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:48:52.378849|tcp|203.0.113.55|58572|10.20.6.40|22|.|3527122309|65535|0|
10:48:52.395568|tcp|203.0.113.55|58572|10.20.6.40|22|P.|3527122309|65535|249|
10:48:52.396744|tcp|10.20.6.40|22|203.0.113.55|58572|P.|1413964113|65535|397|
10:48:52.397044|tcp|203.0.113.55|58572|10.20.6.40|22|.|3527122558|65535|0|
10:48:52.417044|tcp|203.0.113.55|58572|10.20.6.40|22|F.|3527122558|65535|0|
10:48:52.417544|tcp|10.20.6.40|22|203.0.113.55|58572|F.|1413964510|65535|0|
10:48:52.417744|tcp|203.0.113.55|58572|10.20.6.40|22|.|3527122559|65535|0|
10:49:07.000000|tcp|10.20.9.40|55262|10.20.6.40|9100|S|1347079705|65535|0|
10:49:07.000789|tcp|10.20.6.40|9100|10.20.9.40|55262|S.|1397509569|62720|0|
10:49:07.001121|tcp|10.20.9.40|55262|10.20.6.40|9100|.|1347079706|65535|0|
10:49:07.035553|tcp|10.20.9.40|55262|10.20.6.40|9100|P.|1347079706|65535|477|GET /metrics HTTP/1.1
10:49:07.037415|tcp|10.20.6.40|9100|10.20.9.40|55262|P.|1397509570|62720|857|
10:49:07.037715|tcp|10.20.9.40|55262|10.20.6.40|9100|.|1347080183|65535|0|
10:49:07.057715|tcp|10.20.9.40|55262|10.20.6.40|9100|F.|1347080183|65535|0|
10:49:07.058215|tcp|10.20.6.40|9100|10.20.9.40|55262|F.|1397510427|62720|0|
10:49:07.058415|tcp|10.20.9.40|55262|10.20.6.40|9100|.|1347080184|65535|0|
10:49:24.066975|tcp|203.0.113.55|37896|10.20.6.40|22|S|3553238711|62720|0|
10:49:24.067575|tcp|10.20.6.40|22|203.0.113.55|37896|S.|1548804340|64240|0|
10:49:24.068522|tcp|203.0.113.55|37896|10.20.6.40|22|.|3553238712|62720|0|
10:49:24.104554|tcp|203.0.113.55|37896|10.20.6.40|22|P.|3553238712|62720|218|SSH-2.0-libssh2_1.10.0
10:49:24.109307|tcp|10.20.6.40|22|203.0.113.55|37896|P.|1548804341|64240|200|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:49:24.109607|tcp|203.0.113.55|37896|10.20.6.40|22|.|3553238930|62720|0|
10:49:24.126139|tcp|203.0.113.55|37896|10.20.6.40|22|P.|3553238930|62720|293|
10:49:24.130779|tcp|10.20.6.40|22|203.0.113.55|37896|P.|1548804541|64240|556|
10:49:24.131079|tcp|203.0.113.55|37896|10.20.6.40|22|.|3553239223|62720|0|
10:49:24.151079|tcp|203.0.113.55|37896|10.20.6.40|22|F.|3553239223|62720|0|
10:49:24.151579|tcp|10.20.6.40|22|203.0.113.55|37896|F.|1548805097|64240|0|
10:49:24.151779|tcp|203.0.113.55|37896|10.20.6.40|22|.|3553239224|62720|0|
10:49:24.422183|tcp|203.0.113.55|39533|10.20.6.40|22|S|3052275967|62720|0|
10:49:24.422893|tcp|10.20.6.40|22|203.0.113.55|39533|S.|39944383|64240|0|
10:49:24.424088|tcp|203.0.113.55|39533|10.20.6.40|22|.|3052275968|62720|0|
10:49:24.445685|tcp|203.0.113.55|39533|10.20.6.40|22|P.|3052275968|62720|181|SSH-2.0-libssh2_1.10.0
10:49:24.450505|tcp|10.20.6.40|22|203.0.113.55|39533|P.|39944384|64240|491|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:49:24.450805|tcp|203.0.113.55|39533|10.20.6.40|22|.|3052276149|62720|0|
10:49:24.482839|tcp|203.0.113.55|39533|10.20.6.40|22|P.|3052276149|62720|232|
10:49:24.484530|tcp|10.20.6.40|22|203.0.113.55|39533|P.|39944875|64240|489|
10:49:24.484830|tcp|203.0.113.55|39533|10.20.6.40|22|.|3052276381|62720|0|
10:49:24.504830|tcp|203.0.113.55|39533|10.20.6.40|22|F.|3052276381|62720|0|
10:49:24.505330|tcp|10.20.6.40|22|203.0.113.55|39533|F.|39945364|64240|0|
10:49:24.505530|tcp|203.0.113.55|39533|10.20.6.40|22|.|3052276382|62720|0|
10:49:30.231954|tcp|203.0.113.55|43142|10.20.6.40|22|S|1727477862|65535|0|
10:49:30.232411|tcp|10.20.6.40|22|203.0.113.55|43142|S.|1008276180|65535|0|
10:49:30.233461|tcp|203.0.113.55|43142|10.20.6.40|22|.|1727477863|65535|0|
10:49:30.280481|tcp|203.0.113.55|43142|10.20.6.40|22|P.|1727477863|65535|159|SSH-2.0-libssh2_1.10.0
10:49:30.282449|tcp|10.20.6.40|22|203.0.113.55|43142|P.|1008276181|65535|591|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:49:30.282749|tcp|203.0.113.55|43142|10.20.6.40|22|.|1727478022|65535|0|
10:49:30.335220|tcp|203.0.113.55|43142|10.20.6.40|22|P.|1727478022|65535|261|
10:49:30.337466|tcp|10.20.6.40|22|203.0.113.55|43142|P.|1008276772|65535|578|
10:49:30.337766|tcp|203.0.113.55|43142|10.20.6.40|22|.|1727478283|65535|0|
10:49:30.357766|tcp|203.0.113.55|43142|10.20.6.40|22|F.|1727478283|65535|0|
10:49:30.358266|tcp|10.20.6.40|22|203.0.113.55|43142|F.|1008277350|65535|0|
10:49:30.358466|tcp|203.0.113.55|43142|10.20.6.40|22|.|1727478284|65535|0|
10:49:49.007943|tcp|203.0.113.55|34026|10.20.6.40|22|S|3994409469|65535|0|
10:49:49.008734|tcp|10.20.6.40|22|203.0.113.55|34026|S.|3059983235|64240|0|
10:49:49.009562|tcp|203.0.113.55|34026|10.20.6.40|22|.|3994409470|65535|0|
10:49:49.040687|tcp|203.0.113.55|34026|10.20.6.40|22|P.|3994409470|65535|177|SSH-2.0-libssh2_1.10.0
10:49:49.041831|tcp|10.20.6.40|22|203.0.113.55|34026|P.|3059983236|64240|296|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:49:49.042131|tcp|203.0.113.55|34026|10.20.6.40|22|.|3994409647|65535|0|
10:49:49.077239|tcp|203.0.113.55|34026|10.20.6.40|22|P.|3994409647|65535|221|
10:49:49.081224|tcp|10.20.6.40|22|203.0.113.55|34026|P.|3059983532|64240|435|
10:49:49.081524|tcp|203.0.113.55|34026|10.20.6.40|22|.|3994409868|65535|0|
10:49:49.101524|tcp|203.0.113.55|34026|10.20.6.40|22|F.|3994409868|65535|0|
10:49:49.102024|tcp|10.20.6.40|22|203.0.113.55|34026|F.|3059983967|64240|0|
10:49:49.102224|tcp|203.0.113.55|34026|10.20.6.40|22|.|3994409869|65535|0|
10:49:50.382940|udp|10.20.6.40|41922|10.20.1.10|53|q|53765|0|40|53765+ A? example.com.
10:49:50.385590|udp|10.20.1.10|53|10.20.6.40|41922|r|53765|0|56|53765 1/0/0 A 192.0.2.10
10:50:00.974801|tcp|203.0.113.55|56621|10.20.6.40|22|S|2802658913|29200|0|
10:50:00.975723|tcp|10.20.6.40|22|203.0.113.55|56621|S.|1402811326|62720|0|
10:50:00.976764|tcp|203.0.113.55|56621|10.20.6.40|22|.|2802658914|29200|0|
10:50:00.994377|tcp|203.0.113.55|56621|10.20.6.40|22|P.|2802658914|29200|252|SSH-2.0-libssh2_1.10.0
10:50:00.997786|tcp|10.20.6.40|22|203.0.113.55|56621|P.|1402811327|62720|307|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:50:00.998086|tcp|203.0.113.55|56621|10.20.6.40|22|.|2802659166|29200|0|
10:50:01.041794|tcp|203.0.113.55|56621|10.20.6.40|22|P.|2802659166|29200|191|
10:50:01.047583|tcp|10.20.6.40|22|203.0.113.55|56621|P.|1402811634|62720|413|
10:50:01.047883|tcp|203.0.113.55|56621|10.20.6.40|22|.|2802659357|29200|0|
10:50:01.067883|tcp|203.0.113.55|56621|10.20.6.40|22|F.|2802659357|29200|0|
10:50:01.068383|tcp|10.20.6.40|22|203.0.113.55|56621|F.|1402812047|62720|0|
10:50:01.068583|tcp|203.0.113.55|56621|10.20.6.40|22|.|2802659358|29200|0|
10:50:07.000000|tcp|10.20.9.40|40169|10.20.6.40|9100|S|838586348|65535|0|
10:50:07.001236|tcp|10.20.6.40|9100|10.20.9.40|40169|S.|1207181775|65535|0|
10:50:07.001716|tcp|10.20.9.40|40169|10.20.6.40|9100|.|838586349|65535|0|
10:50:07.055373|tcp|10.20.9.40|40169|10.20.6.40|9100|P.|838586349|65535|502|GET /metrics HTTP/1.1
10:50:07.056376|tcp|10.20.6.40|9100|10.20.9.40|40169|P.|1207181776|65535|918|
10:50:07.056676|tcp|10.20.9.40|40169|10.20.6.40|9100|.|838586851|65535|0|
10:50:07.076676|tcp|10.20.9.40|40169|10.20.6.40|9100|F.|838586851|65535|0|
10:50:07.077176|tcp|10.20.6.40|9100|10.20.9.40|40169|F.|1207182694|65535|0|
10:50:07.077376|tcp|10.20.9.40|40169|10.20.6.40|9100|.|838586852|65535|0|
10:50:27.288149|tcp|203.0.113.55|58173|10.20.6.40|22|S|3820622564|64240|0|
10:50:27.289265|tcp|10.20.6.40|22|203.0.113.55|58173|S.|3682024986|64240|0|
10:50:27.289725|tcp|203.0.113.55|58173|10.20.6.40|22|.|3820622565|64240|0|
10:50:27.337061|tcp|203.0.113.55|58173|10.20.6.40|22|P.|3820622565|64240|162|SSH-2.0-libssh2_1.10.0
10:50:27.339094|tcp|10.20.6.40|22|203.0.113.55|58173|P.|3682024987|64240|476|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:50:27.339394|tcp|203.0.113.55|58173|10.20.6.40|22|.|3820622727|64240|0|
10:50:27.384888|tcp|203.0.113.55|58173|10.20.6.40|22|P.|3820622727|64240|282|
10:50:27.389075|tcp|10.20.6.40|22|203.0.113.55|58173|P.|3682025463|64240|182|
10:50:27.389375|tcp|203.0.113.55|58173|10.20.6.40|22|.|3820623009|64240|0|
10:50:27.409375|tcp|203.0.113.55|58173|10.20.6.40|22|F.|3820623009|64240|0|
10:50:27.409875|tcp|10.20.6.40|22|203.0.113.55|58173|F.|3682025645|64240|0|
10:50:27.410075|tcp|203.0.113.55|58173|10.20.6.40|22|.|3820623010|64240|0|
10:50:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 26
10:50:31.000712|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 26
10:50:40.877883|tcp|203.0.113.55|45024|10.20.6.40|22|S|226423331|65535|0|
10:50:40.879248|tcp|10.20.6.40|22|203.0.113.55|45024|S.|1664003321|29200|0|
10:50:40.880093|tcp|203.0.113.55|45024|10.20.6.40|22|.|226423332|65535|0|
10:50:40.892841|tcp|203.0.113.55|45024|10.20.6.40|22|P.|226423332|65535|174|SSH-2.0-libssh2_1.10.0
10:50:40.898201|tcp|10.20.6.40|22|203.0.113.55|45024|P.|1664003322|29200|458|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:50:40.898501|tcp|203.0.113.55|45024|10.20.6.40|22|.|226423506|65535|0|
10:50:40.922493|tcp|203.0.113.55|45024|10.20.6.40|22|P.|226423506|65535|155|
10:50:40.926439|tcp|10.20.6.40|22|203.0.113.55|45024|P.|1664003780|29200|436|
10:50:40.926739|tcp|203.0.113.55|45024|10.20.6.40|22|.|226423661|65535|0|
10:50:40.946739|tcp|203.0.113.55|45024|10.20.6.40|22|F.|226423661|65535|0|
10:50:40.947239|tcp|10.20.6.40|22|203.0.113.55|45024|F.|1664004216|29200|0|
10:50:40.947439|tcp|203.0.113.55|45024|10.20.6.40|22|.|226423662|65535|0|
10:50:41.217035|tcp|203.0.113.55|34914|10.20.6.40|22|S|2878002733|65535|0|
10:50:41.218323|tcp|10.20.6.40|22|203.0.113.55|34914|S.|1152388523|65535|0|
10:50:41.218723|tcp|203.0.113.55|34914|10.20.6.40|22|.|2878002734|65535|0|
10:50:41.246441|tcp|203.0.113.55|34914|10.20.6.40|22|P.|2878002734|65535|191|SSH-2.0-libssh2_1.10.0
10:50:41.249232|tcp|10.20.6.40|22|203.0.113.55|34914|P.|1152388524|65535|233|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:50:41.249532|tcp|203.0.113.55|34914|10.20.6.40|22|.|2878002925|65535|0|
10:50:41.287594|tcp|203.0.113.55|34914|10.20.6.40|22|P.|2878002925|65535|297|
10:50:41.291189|tcp|10.20.6.40|22|203.0.113.55|34914|P.|1152388757|65535|243|
10:50:41.291489|tcp|203.0.113.55|34914|10.20.6.40|22|.|2878003222|65535|0|
10:50:41.311489|tcp|203.0.113.55|34914|10.20.6.40|22|F.|2878003222|65535|0|
10:50:41.311989|tcp|10.20.6.40|22|203.0.113.55|34914|F.|1152389000|65535|0|
10:50:41.312189|tcp|203.0.113.55|34914|10.20.6.40|22|.|2878003223|65535|0|
10:50:48.053649|tcp|203.0.113.55|44287|10.20.6.40|22|S|2068496711|62720|0|
10:50:48.054744|tcp|10.20.6.40|22|203.0.113.55|44287|S.|1007508219|62720|0|
10:50:48.055064|tcp|203.0.113.55|44287|10.20.6.40|22|.|2068496712|62720|0|
10:50:48.083454|tcp|203.0.113.55|44287|10.20.6.40|22|P.|2068496712|62720|154|SSH-2.0-libssh2_1.10.0
10:50:48.088235|tcp|10.20.6.40|22|203.0.113.55|44287|P.|1007508220|62720|562|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:50:48.088535|tcp|203.0.113.55|44287|10.20.6.40|22|.|2068496866|62720|0|
10:50:48.117246|tcp|203.0.113.55|44287|10.20.6.40|22|P.|2068496866|62720|211|
10:50:48.120801|tcp|10.20.6.40|22|203.0.113.55|44287|P.|1007508782|62720|230|
10:50:48.121101|tcp|203.0.113.55|44287|10.20.6.40|22|.|2068497077|62720|0|
10:50:48.141101|tcp|203.0.113.55|44287|10.20.6.40|22|F.|2068497077|62720|0|
10:50:48.141601|tcp|10.20.6.40|22|203.0.113.55|44287|F.|1007509012|62720|0|
10:50:48.141801|tcp|203.0.113.55|44287|10.20.6.40|22|.|2068497078|62720|0|
10:50:52.169028|udp|10.20.6.40|55061|10.20.1.10|53|q|26977|0|64|26977+ A? rmg-monitor-01.ridgelinemed.example.
10:50:52.171722|udp|10.20.1.10|53|10.20.6.40|55061|r|26977|0|80|26977 1/0/0 A 10.20.9.40
10:50:54.539737|tcp|203.0.113.55|53184|10.20.6.40|22|S|3999951907|64240|0|
10:50:54.540512|tcp|10.20.6.40|22|203.0.113.55|53184|S.|1327090357|64240|0|
10:50:54.541217|tcp|203.0.113.55|53184|10.20.6.40|22|.|3999951908|64240|0|
10:50:54.551682|tcp|203.0.113.55|53184|10.20.6.40|22|P.|3999951908|64240|266|SSH-2.0-libssh2_1.10.0
10:50:54.556219|tcp|10.20.6.40|22|203.0.113.55|53184|P.|1327090358|64240|240|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:50:54.556519|tcp|203.0.113.55|53184|10.20.6.40|22|.|3999952174|64240|0|
10:50:54.588469|tcp|203.0.113.55|53184|10.20.6.40|22|P.|3999952174|64240|298|
10:50:54.592502|tcp|10.20.6.40|22|203.0.113.55|53184|P.|1327090598|64240|568|
10:50:54.592802|tcp|203.0.113.55|53184|10.20.6.40|22|.|3999952472|64240|0|
10:50:54.612802|tcp|203.0.113.55|53184|10.20.6.40|22|F.|3999952472|64240|0|
10:50:54.613302|tcp|10.20.6.40|22|203.0.113.55|53184|F.|1327091166|64240|0|
10:50:54.613502|tcp|203.0.113.55|53184|10.20.6.40|22|.|3999952473|64240|0|
10:51:00.041556|tcp|203.0.113.55|56343|10.20.6.40|22|S|1804323328|62720|0|
10:51:00.042829|tcp|10.20.6.40|22|203.0.113.55|56343|S.|2346829006|64240|0|
10:51:00.043336|tcp|203.0.113.55|56343|10.20.6.40|22|.|1804323329|62720|0|
10:51:00.067623|tcp|203.0.113.55|56343|10.20.6.40|22|P.|1804323329|62720|231|SSH-2.0-libssh2_1.10.0
10:51:00.069194|tcp|10.20.6.40|22|203.0.113.55|56343|P.|2346829007|64240|354|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:51:00.069494|tcp|203.0.113.55|56343|10.20.6.40|22|.|1804323560|62720|0|
10:51:00.107779|tcp|203.0.113.55|56343|10.20.6.40|22|P.|1804323560|62720|227|
10:51:00.111771|tcp|10.20.6.40|22|203.0.113.55|56343|P.|2346829361|64240|181|
10:51:00.112071|tcp|203.0.113.55|56343|10.20.6.40|22|.|1804323787|62720|0|
10:51:00.132071|tcp|203.0.113.55|56343|10.20.6.40|22|F.|1804323787|62720|0|
10:51:00.132571|tcp|10.20.6.40|22|203.0.113.55|56343|F.|2346829542|64240|0|
10:51:00.132771|tcp|203.0.113.55|56343|10.20.6.40|22|.|1804323788|62720|0|
10:51:07.000000|tcp|10.20.9.40|58739|10.20.6.40|9100|S|99682487|65535|0|
10:51:07.001109|tcp|10.20.6.40|9100|10.20.9.40|58739|S.|2794212827|65535|0|
10:51:07.001866|tcp|10.20.9.40|58739|10.20.6.40|9100|.|99682488|65535|0|
10:51:07.025701|tcp|10.20.9.40|58739|10.20.6.40|9100|P.|99682488|65535|754|GET /metrics HTTP/1.1
10:51:07.027936|tcp|10.20.6.40|9100|10.20.9.40|58739|P.|2794212828|65535|1765|
10:51:07.028236|tcp|10.20.9.40|58739|10.20.6.40|9100|.|99683242|65535|0|
10:51:07.048236|tcp|10.20.9.40|58739|10.20.6.40|9100|F.|99683242|65535|0|
10:51:07.048736|tcp|10.20.6.40|9100|10.20.9.40|58739|F.|2794214593|65535|0|
10:51:07.048936|tcp|10.20.9.40|58739|10.20.6.40|9100|.|99683243|65535|0|
10:51:10.569545|tcp|203.0.113.55|60794|10.20.6.40|22|S|696526956|29200|0|
10:51:10.570274|tcp|10.20.6.40|22|203.0.113.55|60794|S.|1790127764|64240|0|
10:51:10.571030|tcp|203.0.113.55|60794|10.20.6.40|22|.|696526957|29200|0|
10:51:10.590326|tcp|203.0.113.55|60794|10.20.6.40|22|P.|696526957|29200|195|SSH-2.0-libssh2_1.10.0
10:51:10.592686|tcp|10.20.6.40|22|203.0.113.55|60794|P.|1790127765|64240|494|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:51:10.592986|tcp|203.0.113.55|60794|10.20.6.40|22|.|696527152|29200|0|
10:51:10.620611|tcp|203.0.113.55|60794|10.20.6.40|22|P.|696527152|29200|216|
10:51:10.621965|tcp|10.20.6.40|22|203.0.113.55|60794|P.|1790128259|64240|551|
10:51:10.622265|tcp|203.0.113.55|60794|10.20.6.40|22|.|696527368|29200|0|
10:51:10.642265|tcp|203.0.113.55|60794|10.20.6.40|22|F.|696527368|29200|0|
10:51:10.642765|tcp|10.20.6.40|22|203.0.113.55|60794|F.|1790128810|64240|0|
10:51:10.642965|tcp|203.0.113.55|60794|10.20.6.40|22|.|696527369|29200|0|
10:51:30.485953|tcp|203.0.113.55|54503|10.20.6.40|22|S|3973910051|29200|0|
10:51:30.486493|tcp|10.20.6.40|22|203.0.113.55|54503|S.|3730616339|64240|0|
10:51:30.487343|tcp|203.0.113.55|54503|10.20.6.40|22|.|3973910052|29200|0|
10:51:30.523186|tcp|203.0.113.55|54503|10.20.6.40|22|P.|3973910052|29200|155|SSH-2.0-libssh2_1.10.0
10:51:30.526055|tcp|10.20.6.40|22|203.0.113.55|54503|P.|3730616340|64240|462|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:51:30.526355|tcp|203.0.113.55|54503|10.20.6.40|22|.|3973910207|29200|0|
10:51:30.577733|tcp|203.0.113.55|54503|10.20.6.40|22|P.|3973910207|29200|193|
10:51:30.580377|tcp|10.20.6.40|22|203.0.113.55|54503|P.|3730616802|64240|533|
10:51:30.580677|tcp|203.0.113.55|54503|10.20.6.40|22|.|3973910400|29200|0|
10:51:30.600677|tcp|203.0.113.55|54503|10.20.6.40|22|F.|3973910400|29200|0|
10:51:30.601177|tcp|10.20.6.40|22|203.0.113.55|54503|F.|3730617335|64240|0|
10:51:30.601377|tcp|203.0.113.55|54503|10.20.6.40|22|.|3973910401|29200|0|
10:51:33.966391|tcp|203.0.113.55|46237|10.20.6.40|22|S|299628132|29200|0|
10:51:33.966905|tcp|10.20.6.40|22|203.0.113.55|46237|S.|539531228|62720|0|
10:51:33.967939|tcp|203.0.113.55|46237|10.20.6.40|22|.|299628133|29200|0|
10:51:33.996945|tcp|203.0.113.55|46237|10.20.6.40|22|P.|299628133|29200|206|SSH-2.0-libssh2_1.10.0
10:51:33.997976|tcp|10.20.6.40|22|203.0.113.55|46237|P.|539531229|62720|294|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:51:33.998276|tcp|203.0.113.55|46237|10.20.6.40|22|.|299628339|29200|0|
10:51:34.051695|tcp|203.0.113.55|46237|10.20.6.40|22|P.|299628339|29200|196|
10:51:34.055131|tcp|10.20.6.40|22|203.0.113.55|46237|P.|539531523|62720|362|
10:51:34.055431|tcp|203.0.113.55|46237|10.20.6.40|22|.|299628535|29200|0|
10:51:34.075431|tcp|203.0.113.55|46237|10.20.6.40|22|F.|299628535|29200|0|
10:51:34.075931|tcp|10.20.6.40|22|203.0.113.55|46237|F.|539531885|62720|0|
10:51:34.076131|tcp|203.0.113.55|46237|10.20.6.40|22|.|299628536|29200|0|
10:51:40.061012|tcp|203.0.113.55|46072|10.20.6.40|22|S|3917208590|29200|0|
10:51:40.061443|tcp|10.20.6.40|22|203.0.113.55|46072|S.|2479439421|62720|0|
10:51:40.062293|tcp|203.0.113.55|46072|10.20.6.40|22|.|3917208591|29200|0|
10:51:40.112133|tcp|203.0.113.55|46072|10.20.6.40|22|P.|3917208591|29200|223|SSH-2.0-libssh2_1.10.0
10:51:40.114372|tcp|10.20.6.40|22|203.0.113.55|46072|P.|2479439422|62720|382|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:51:40.114672|tcp|203.0.113.55|46072|10.20.6.40|22|.|3917208814|29200|0|
10:51:40.128952|tcp|203.0.113.55|46072|10.20.6.40|22|P.|3917208814|29200|254|
10:51:40.132308|tcp|10.20.6.40|22|203.0.113.55|46072|P.|2479439804|62720|328|
10:51:40.132608|tcp|203.0.113.55|46072|10.20.6.40|22|.|3917209068|29200|0|
10:51:40.152608|tcp|203.0.113.55|46072|10.20.6.40|22|F.|3917209068|29200|0|
10:51:40.153108|tcp|10.20.6.40|22|203.0.113.55|46072|F.|2479440132|62720|0|
10:51:40.153308|tcp|203.0.113.55|46072|10.20.6.40|22|.|3917209069|29200|0|
10:51:40.288338|udp|10.20.6.40|35287|10.20.1.10|53|q|28416|0|39|28416+ A? ubuntu.com.
10:51:40.290926|udp|10.20.1.10|53|10.20.6.40|35287|r|28416|0|55|28416 1/0/0 A 192.0.2.30
10:51:56.486615|tcp|203.0.113.55|49424|10.20.6.40|22|S|1083547820|29200|0|
10:51:56.487720|tcp|10.20.6.40|22|203.0.113.55|49424|S.|2231065515|62720|0|
10:51:56.488190|tcp|203.0.113.55|49424|10.20.6.40|22|.|1083547821|29200|0|
10:51:56.541773|tcp|203.0.113.55|49424|10.20.6.40|22|P.|1083547821|29200|276|SSH-2.0-libssh2_1.10.0
10:51:56.543205|tcp|10.20.6.40|22|203.0.113.55|49424|P.|2231065516|62720|209|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:51:56.543505|tcp|203.0.113.55|49424|10.20.6.40|22|.|1083548097|29200|0|
10:51:56.590213|tcp|203.0.113.55|49424|10.20.6.40|22|P.|1083548097|29200|299|
10:51:56.591827|tcp|10.20.6.40|22|203.0.113.55|49424|P.|2231065725|62720|454|
10:51:56.592127|tcp|203.0.113.55|49424|10.20.6.40|22|.|1083548396|29200|0|
10:51:56.612127|tcp|203.0.113.55|49424|10.20.6.40|22|F.|1083548396|29200|0|
10:51:56.612627|tcp|10.20.6.40|22|203.0.113.55|49424|F.|2231066179|62720|0|
10:51:56.612827|tcp|203.0.113.55|49424|10.20.6.40|22|.|1083548397|29200|0|
10:52:07.000000|tcp|10.20.9.40|53881|10.20.6.40|9100|S|3332795646|29200|0|
10:52:07.000763|tcp|10.20.6.40|9100|10.20.9.40|53881|S.|1254406351|29200|0|
10:52:07.001807|tcp|10.20.9.40|53881|10.20.6.40|9100|.|3332795647|29200|0|
10:52:07.018181|tcp|10.20.9.40|53881|10.20.6.40|9100|P.|3332795647|29200|492|GET /metrics HTTP/1.1
10:52:07.021780|tcp|10.20.6.40|9100|10.20.9.40|53881|P.|1254406352|29200|1286|
10:52:07.022080|tcp|10.20.9.40|53881|10.20.6.40|9100|.|3332796139|29200|0|
10:52:07.042080|tcp|10.20.9.40|53881|10.20.6.40|9100|F.|3332796139|29200|0|
10:52:07.042580|tcp|10.20.6.40|9100|10.20.9.40|53881|F.|1254407638|29200|0|
10:52:07.042780|tcp|10.20.9.40|53881|10.20.6.40|9100|.|3332796140|29200|0|
10:52:10.418124|tcp|203.0.113.55|53031|10.20.6.40|22|S|2071006465|65535|0|
10:52:10.418974|tcp|10.20.6.40|22|203.0.113.55|53031|S.|2558138936|64240|0|
10:52:10.419826|tcp|203.0.113.55|53031|10.20.6.40|22|.|2071006466|65535|0|
10:52:10.470705|tcp|203.0.113.55|53031|10.20.6.40|22|P.|2071006466|65535|176|SSH-2.0-libssh2_1.10.0
10:52:10.474449|tcp|10.20.6.40|22|203.0.113.55|53031|P.|2558138937|64240|489|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:52:10.474749|tcp|203.0.113.55|53031|10.20.6.40|22|.|2071006642|65535|0|
10:52:10.501072|tcp|203.0.113.55|53031|10.20.6.40|22|P.|2071006642|65535|252|
10:52:10.503663|tcp|10.20.6.40|22|203.0.113.55|53031|P.|2558139426|64240|522|
10:52:10.503963|tcp|203.0.113.55|53031|10.20.6.40|22|.|2071006894|65535|0|
10:52:10.523963|tcp|203.0.113.55|53031|10.20.6.40|22|F.|2071006894|65535|0|
10:52:10.524463|tcp|10.20.6.40|22|203.0.113.55|53031|F.|2558139948|64240|0|
10:52:10.524663|tcp|203.0.113.55|53031|10.20.6.40|22|.|2071006895|65535|0|
10:52:22.251300|tcp|203.0.113.12|37764|10.20.6.40|5900|S|3386867803|62720|0|
10:52:22.251506|tcp|10.20.6.40|5900|203.0.113.12|37764|R.|0|0|0|
10:52:23.489758|udp|10.20.6.40|54090|10.20.1.10|53|q|27302|0|64|27302+ A? rmg-monitor-01.ridgelinemed.example.
10:52:23.492610|udp|10.20.1.10|53|10.20.6.40|54090|r|27302|0|80|27302 1/0/0 A 10.20.9.40
10:52:23.989189|tcp|203.0.113.12|39493|10.20.6.40|3389|S|2273560468|64240|0|
10:52:23.989532|tcp|10.20.6.40|3389|203.0.113.12|39493|R.|0|0|0|
10:52:24.197901|tcp|203.0.113.12|54399|10.20.6.40|25|S|3581275727|62720|0|
10:52:24.198333|tcp|10.20.6.40|25|203.0.113.12|54399|R.|0|0|0|
10:52:24.504567|tcp|203.0.113.55|52238|10.20.6.40|22|S|1340804681|62720|0|
10:52:24.505054|tcp|10.20.6.40|22|203.0.113.55|52238|S.|602042395|29200|0|
10:52:24.506075|tcp|203.0.113.55|52238|10.20.6.40|22|.|1340804682|62720|0|
10:52:24.565652|tcp|203.0.113.55|52238|10.20.6.40|22|P.|1340804682|62720|266|SSH-2.0-libssh2_1.10.0
10:52:24.570051|tcp|10.20.6.40|22|203.0.113.55|52238|P.|602042396|29200|429|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:52:24.570351|tcp|203.0.113.55|52238|10.20.6.40|22|.|1340804948|62720|0|
10:52:24.593489|tcp|203.0.113.55|52238|10.20.6.40|22|P.|1340804948|62720|256|
10:52:24.597655|tcp|10.20.6.40|22|203.0.113.55|52238|P.|602042825|29200|336|
10:52:24.597955|tcp|203.0.113.55|52238|10.20.6.40|22|.|1340805204|62720|0|
10:52:24.617955|tcp|203.0.113.55|52238|10.20.6.40|22|F.|1340805204|62720|0|
10:52:24.618455|tcp|10.20.6.40|22|203.0.113.55|52238|F.|602043161|29200|0|
10:52:24.618655|tcp|203.0.113.55|52238|10.20.6.40|22|.|1340805205|62720|0|
10:52:24.652114|tcp|203.0.113.55|60460|10.20.6.40|22|S|3766168076|64240|0|
10:52:24.653166|tcp|10.20.6.40|22|203.0.113.55|60460|S.|2089946942|64240|0|
10:52:24.653593|tcp|203.0.113.55|60460|10.20.6.40|22|.|3766168077|64240|0|
10:52:24.672496|tcp|203.0.113.55|60460|10.20.6.40|22|P.|3766168077|64240|283|SSH-2.0-libssh2_1.10.0
10:52:24.673810|tcp|10.20.6.40|22|203.0.113.55|60460|P.|2089946943|64240|470|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:52:24.674110|tcp|203.0.113.55|60460|10.20.6.40|22|.|3766168360|64240|0|
10:52:24.713411|tcp|203.0.113.55|60460|10.20.6.40|22|P.|3766168360|64240|171|
10:52:24.718469|tcp|10.20.6.40|22|203.0.113.55|60460|P.|2089947413|64240|598|
10:52:24.718769|tcp|203.0.113.55|60460|10.20.6.40|22|.|3766168531|64240|0|
10:52:24.738769|tcp|203.0.113.55|60460|10.20.6.40|22|F.|3766168531|64240|0|
10:52:24.739269|tcp|10.20.6.40|22|203.0.113.55|60460|F.|2089948011|64240|0|
10:52:24.739469|tcp|203.0.113.55|60460|10.20.6.40|22|.|3766168532|64240|0|
10:52:30.258796|tcp|203.0.113.55|60484|10.20.6.40|22|S|2128570695|29200|0|
10:52:30.259910|tcp|10.20.6.40|22|203.0.113.55|60484|S.|2281848293|64240|0|
10:52:30.260965|tcp|203.0.113.55|60484|10.20.6.40|22|.|2128570696|29200|0|
10:52:30.287870|tcp|203.0.113.55|60484|10.20.6.40|22|P.|2128570696|29200|274|SSH-2.0-libssh2_1.10.0
10:52:30.291775|tcp|10.20.6.40|22|203.0.113.55|60484|P.|2281848294|64240|218|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:52:30.292075|tcp|203.0.113.55|60484|10.20.6.40|22|.|2128570970|29200|0|
10:52:30.339727|tcp|203.0.113.55|60484|10.20.6.40|22|P.|2128570970|29200|259|
10:52:30.342953|tcp|10.20.6.40|22|203.0.113.55|60484|P.|2281848512|64240|415|
10:52:30.343253|tcp|203.0.113.55|60484|10.20.6.40|22|.|2128571229|29200|0|
10:52:30.363253|tcp|203.0.113.55|60484|10.20.6.40|22|F.|2128571229|29200|0|
10:52:30.363753|tcp|10.20.6.40|22|203.0.113.55|60484|F.|2281848927|64240|0|
10:52:30.363953|tcp|203.0.113.55|60484|10.20.6.40|22|.|2128571230|29200|0|
10:52:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 27
10:52:31.000305|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 27
10:52:33.787971|tcp|203.0.113.12|46631|10.20.6.40|3306|S|356799730|62720|0|
10:52:33.788183|tcp|10.20.6.40|3306|203.0.113.12|46631|R.|0|0|0|
10:52:35.911561|tcp|203.0.113.12|38323|10.20.6.40|21|S|573723503|62720|0|
10:52:35.912094|tcp|10.20.6.40|21|203.0.113.12|38323|R.|0|0|0|
10:52:36.969884|tcp|203.0.113.12|59992|10.20.6.40|1433|S|3141651135|62720|0|
10:52:36.970339|tcp|10.20.6.40|1433|203.0.113.12|59992|R.|0|0|0|
10:52:37.011348|tcp|203.0.113.12|44595|10.20.6.40|135|S|744350533|29200|0|
10:52:37.011581|tcp|10.20.6.40|135|203.0.113.12|44595|R.|0|0|0|
10:52:38.406259|tcp|203.0.113.12|56469|10.20.6.40|23|S|3768702849|65535|0|
10:52:38.406504|tcp|10.20.6.40|23|203.0.113.12|56469|R.|0|0|0|
10:52:52.937334|tcp|203.0.113.55|49836|10.20.6.40|22|S|3039680049|29200|0|
10:52:52.938189|tcp|10.20.6.40|22|203.0.113.55|49836|S.|2064060150|65535|0|
10:52:52.939343|tcp|203.0.113.55|49836|10.20.6.40|22|.|3039680050|29200|0|
10:52:52.958597|tcp|203.0.113.55|49836|10.20.6.40|22|P.|3039680050|29200|187|SSH-2.0-libssh2_1.10.0
10:52:52.963227|tcp|10.20.6.40|22|203.0.113.55|49836|P.|2064060151|65535|165|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:52:52.963527|tcp|203.0.113.55|49836|10.20.6.40|22|.|3039680237|29200|0|
10:52:53.015271|tcp|203.0.113.55|49836|10.20.6.40|22|P.|3039680237|29200|156|
10:52:53.018645|tcp|10.20.6.40|22|203.0.113.55|49836|P.|2064060316|65535|328|
10:52:53.018945|tcp|203.0.113.55|49836|10.20.6.40|22|.|3039680393|29200|0|
10:52:53.038945|tcp|203.0.113.55|49836|10.20.6.40|22|F.|3039680393|29200|0|
10:52:53.039445|tcp|10.20.6.40|22|203.0.113.55|49836|F.|2064060644|65535|0|
10:52:53.039645|tcp|203.0.113.55|49836|10.20.6.40|22|.|3039680394|29200|0|
10:52:54.215815|tcp|10.20.6.40|48685|192.0.2.20|443|S|1025786967|62720|0|
10:52:54.216748|tcp|192.0.2.20|443|10.20.6.40|48685|S.|2558523784|64240|0|
10:52:54.217437|tcp|10.20.6.40|48685|192.0.2.20|443|.|1025786968|62720|0|
10:52:54.263427|tcp|10.20.6.40|48685|192.0.2.20|443|P.|1025786968|62720|808|TLS SNI: search.example.net
10:52:54.266079|tcp|192.0.2.20|443|10.20.6.40|48685|P.|2558523785|64240|1110|
10:52:54.266379|tcp|10.20.6.40|48685|192.0.2.20|443|.|1025787776|62720|0|
10:52:54.298304|tcp|10.20.6.40|48685|192.0.2.20|443|P.|1025787776|62720|889|
10:52:54.300538|tcp|192.0.2.20|443|10.20.6.40|48685|P.|2558524895|64240|2189|
10:52:54.300838|tcp|10.20.6.40|48685|192.0.2.20|443|.|1025788665|62720|0|
10:52:54.312287|tcp|10.20.6.40|48685|192.0.2.20|443|P.|1025788665|62720|944|
10:52:54.314961|tcp|192.0.2.20|443|10.20.6.40|48685|P.|2558527084|64240|1258|
10:52:54.315261|tcp|10.20.6.40|48685|192.0.2.20|443|.|1025789609|62720|0|
10:52:54.350067|tcp|10.20.6.40|48685|192.0.2.20|443|P.|1025789609|62720|611|
10:52:54.353072|tcp|192.0.2.20|443|10.20.6.40|48685|P.|2558528342|64240|1229|
10:52:54.353372|tcp|10.20.6.40|48685|192.0.2.20|443|.|1025790220|62720|0|
10:52:54.373372|tcp|10.20.6.40|48685|192.0.2.20|443|F.|1025790220|62720|0|
10:52:54.373872|tcp|192.0.2.20|443|10.20.6.40|48685|F.|2558529571|64240|0|
10:52:54.374072|tcp|10.20.6.40|48685|192.0.2.20|443|.|1025790221|62720|0|
10:53:07.000000|tcp|10.20.9.40|42131|10.20.6.40|9100|S|1830532940|29200|0|
10:53:07.001114|tcp|10.20.6.40|9100|10.20.9.40|42131|S.|2511006813|64240|0|
10:53:07.002169|tcp|10.20.9.40|42131|10.20.6.40|9100|.|1830532941|29200|0|
10:53:07.061679|tcp|10.20.9.40|42131|10.20.6.40|9100|P.|1830532941|29200|561|GET /metrics HTTP/1.1
10:53:07.065584|tcp|10.20.6.40|9100|10.20.9.40|42131|P.|2511006814|64240|1300|
10:53:07.065884|tcp|10.20.9.40|42131|10.20.6.40|9100|.|1830533502|29200|0|
10:53:07.085884|tcp|10.20.9.40|42131|10.20.6.40|9100|F.|1830533502|29200|0|
10:53:07.086384|tcp|10.20.6.40|9100|10.20.9.40|42131|F.|2511008114|64240|0|
10:53:07.086584|tcp|10.20.9.40|42131|10.20.6.40|9100|.|1830533503|29200|0|
10:53:21.129437|udp|10.20.6.40|43031|10.20.1.10|53|q|26320|0|64|26320+ A? rmg-monitor-01.ridgelinemed.example.
10:53:21.132579|udp|10.20.1.10|53|10.20.6.40|43031|r|26320|0|80|26320 1/0/0 A 10.20.9.40
10:53:30.338736|tcp|203.0.113.55|49112|10.20.6.40|22|S|3887388516|62720|0|
10:53:30.339331|tcp|10.20.6.40|22|203.0.113.55|49112|S.|2225582420|29200|0|
10:53:30.340515|tcp|203.0.113.55|49112|10.20.6.40|22|.|3887388517|62720|0|
10:53:30.378697|tcp|203.0.113.55|49112|10.20.6.40|22|P.|3887388517|62720|169|SSH-2.0-libssh2_1.10.0
10:53:30.384109|tcp|10.20.6.40|22|203.0.113.55|49112|P.|2225582421|29200|233|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:53:30.384409|tcp|203.0.113.55|49112|10.20.6.40|22|.|3887388686|62720|0|
10:53:30.420668|tcp|203.0.113.55|49112|10.20.6.40|22|P.|3887388686|62720|269|
10:53:30.423596|tcp|10.20.6.40|22|203.0.113.55|49112|P.|2225582654|29200|561|
10:53:30.423896|tcp|203.0.113.55|49112|10.20.6.40|22|.|3887388955|62720|0|
10:53:30.443896|tcp|203.0.113.55|49112|10.20.6.40|22|F.|3887388955|62720|0|
10:53:30.444396|tcp|10.20.6.40|22|203.0.113.55|49112|F.|2225583215|29200|0|
10:53:30.444596|tcp|203.0.113.55|49112|10.20.6.40|22|.|3887388956|62720|0|
10:53:32.309679|tcp|203.0.113.55|58343|10.20.6.40|22|S|3644810439|62720|0|
10:53:32.310921|tcp|10.20.6.40|22|203.0.113.55|58343|S.|3095499748|65535|0|
10:53:32.311415|tcp|203.0.113.55|58343|10.20.6.40|22|.|3644810440|62720|0|
10:53:32.331924|tcp|203.0.113.55|58343|10.20.6.40|22|P.|3644810440|62720|214|SSH-2.0-libssh2_1.10.0
10:53:32.333953|tcp|10.20.6.40|22|203.0.113.55|58343|P.|3095499749|65535|366|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:53:32.334253|tcp|203.0.113.55|58343|10.20.6.40|22|.|3644810654|62720|0|
10:53:32.382822|tcp|203.0.113.55|58343|10.20.6.40|22|P.|3644810654|62720|226|
10:53:32.386470|tcp|10.20.6.40|22|203.0.113.55|58343|P.|3095500115|65535|409|
10:53:32.386770|tcp|203.0.113.55|58343|10.20.6.40|22|.|3644810880|62720|0|
10:53:32.406770|tcp|203.0.113.55|58343|10.20.6.40|22|F.|3644810880|62720|0|
10:53:32.407270|tcp|10.20.6.40|22|203.0.113.55|58343|F.|3095500524|65535|0|
10:53:32.407470|tcp|203.0.113.55|58343|10.20.6.40|22|.|3644810881|62720|0|
10:53:40.039515|tcp|203.0.113.55|48410|10.20.6.40|22|S|3691482235|29200|0|
10:53:40.039925|tcp|10.20.6.40|22|203.0.113.55|48410|S.|440018277|64240|0|
10:53:40.040473|tcp|203.0.113.55|48410|10.20.6.40|22|.|3691482236|29200|0|
10:53:40.066968|tcp|203.0.113.55|48410|10.20.6.40|22|P.|3691482236|29200|292|SSH-2.0-libssh2_1.10.0
10:53:40.072872|tcp|10.20.6.40|22|203.0.113.55|48410|P.|440018278|64240|454|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:53:40.073172|tcp|203.0.113.55|48410|10.20.6.40|22|.|3691482528|29200|0|
10:53:40.091457|tcp|203.0.113.55|48410|10.20.6.40|22|P.|3691482528|29200|192|
10:53:40.095272|tcp|10.20.6.40|22|203.0.113.55|48410|P.|440018732|64240|225|
10:53:40.095572|tcp|203.0.113.55|48410|10.20.6.40|22|.|3691482720|29200|0|
10:53:40.115572|tcp|203.0.113.55|48410|10.20.6.40|22|F.|3691482720|29200|0|
10:53:40.116072|tcp|10.20.6.40|22|203.0.113.55|48410|F.|440018957|64240|0|
10:53:40.116272|tcp|203.0.113.55|48410|10.20.6.40|22|.|3691482721|29200|0|
10:53:40.328055|tcp|203.0.113.55|58634|10.20.6.40|22|S|2747156203|64240|0|
10:53:40.328607|tcp|10.20.6.40|22|203.0.113.55|58634|S.|717677098|62720|0|
10:53:40.328864|tcp|203.0.113.55|58634|10.20.6.40|22|.|2747156204|64240|0|
10:53:40.360052|tcp|203.0.113.55|58634|10.20.6.40|22|P.|2747156204|64240|248|SSH-2.0-libssh2_1.10.0
10:53:40.363272|tcp|10.20.6.40|22|203.0.113.55|58634|P.|717677099|62720|544|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:53:40.363572|tcp|203.0.113.55|58634|10.20.6.40|22|.|2747156452|64240|0|
10:53:40.404353|tcp|203.0.113.55|58634|10.20.6.40|22|P.|2747156452|64240|273|
10:53:40.409683|tcp|10.20.6.40|22|203.0.113.55|58634|P.|717677643|62720|240|
10:53:40.409983|tcp|203.0.113.55|58634|10.20.6.40|22|.|2747156725|64240|0|
10:53:40.429983|tcp|203.0.113.55|58634|10.20.6.40|22|F.|2747156725|64240|0|
10:53:40.430483|tcp|10.20.6.40|22|203.0.113.55|58634|F.|717677883|62720|0|
10:53:40.430683|tcp|203.0.113.55|58634|10.20.6.40|22|.|2747156726|64240|0|
10:53:46.281236|tcp|203.0.113.55|53288|10.20.6.40|22|S|3804792551|62720|0|
10:53:46.281819|tcp|10.20.6.40|22|203.0.113.55|53288|S.|371581010|29200|0|
10:53:46.282775|tcp|203.0.113.55|53288|10.20.6.40|22|.|3804792552|62720|0|
10:53:46.300832|tcp|203.0.113.55|53288|10.20.6.40|22|P.|3804792552|62720|248|SSH-2.0-libssh2_1.10.0
10:53:46.306317|tcp|10.20.6.40|22|203.0.113.55|53288|P.|371581011|29200|322|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:53:46.306617|tcp|203.0.113.55|53288|10.20.6.40|22|.|3804792800|62720|0|
10:53:46.338866|tcp|203.0.113.55|53288|10.20.6.40|22|P.|3804792800|62720|183|
10:53:46.340854|tcp|10.20.6.40|22|203.0.113.55|53288|P.|371581333|29200|201|
10:53:46.341154|tcp|203.0.113.55|53288|10.20.6.40|22|.|3804792983|62720|0|
10:53:46.361154|tcp|203.0.113.55|53288|10.20.6.40|22|F.|3804792983|62720|0|
10:53:46.361654|tcp|10.20.6.40|22|203.0.113.55|53288|F.|371581534|29200|0|
10:53:46.361854|tcp|203.0.113.55|53288|10.20.6.40|22|.|3804792984|62720|0|
10:53:48.044018|tcp|203.0.113.55|35356|10.20.6.40|22|S|1285543301|62720|0|
10:53:48.044697|tcp|10.20.6.40|22|203.0.113.55|35356|S.|2344053511|62720|0|
10:53:48.044958|tcp|203.0.113.55|35356|10.20.6.40|22|.|1285543302|62720|0|
10:53:48.096114|tcp|203.0.113.55|35356|10.20.6.40|22|P.|1285543302|62720|221|SSH-2.0-libssh2_1.10.0
10:53:48.099753|tcp|10.20.6.40|22|203.0.113.55|35356|P.|2344053512|62720|318|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:53:48.100053|tcp|203.0.113.55|35356|10.20.6.40|22|.|1285543523|62720|0|
10:53:48.157170|tcp|203.0.113.55|35356|10.20.6.40|22|P.|1285543523|62720|291|
10:53:48.161916|tcp|10.20.6.40|22|203.0.113.55|35356|P.|2344053830|62720|172|
10:53:48.162216|tcp|203.0.113.55|35356|10.20.6.40|22|.|1285543814|62720|0|
10:53:48.182216|tcp|203.0.113.55|35356|10.20.6.40|22|F.|1285543814|62720|0|
10:53:48.182716|tcp|10.20.6.40|22|203.0.113.55|35356|F.|2344054002|62720|0|
10:53:48.182916|tcp|203.0.113.55|35356|10.20.6.40|22|.|1285543815|62720|0|
10:53:50.465856|tcp|203.0.113.55|55032|10.20.6.40|22|S|2108198134|62720|0|
10:53:50.467027|tcp|10.20.6.40|22|203.0.113.55|55032|S.|121332995|64240|0|
10:53:50.467275|tcp|203.0.113.55|55032|10.20.6.40|22|.|2108198135|62720|0|
10:53:50.512868|tcp|203.0.113.55|55032|10.20.6.40|22|P.|2108198135|62720|268|SSH-2.0-libssh2_1.10.0
10:53:50.518011|tcp|10.20.6.40|22|203.0.113.55|55032|P.|121332996|64240|486|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:53:50.518311|tcp|203.0.113.55|55032|10.20.6.40|22|.|2108198403|62720|0|
10:53:50.537398|tcp|203.0.113.55|55032|10.20.6.40|22|P.|2108198403|62720|276|
10:53:50.540231|tcp|10.20.6.40|22|203.0.113.55|55032|P.|121333482|64240|440|
10:53:50.540531|tcp|203.0.113.55|55032|10.20.6.40|22|.|2108198679|62720|0|
10:53:50.560531|tcp|203.0.113.55|55032|10.20.6.40|22|F.|2108198679|62720|0|
10:53:50.561031|tcp|10.20.6.40|22|203.0.113.55|55032|F.|121333922|64240|0|
10:53:50.561231|tcp|203.0.113.55|55032|10.20.6.40|22|.|2108198680|62720|0|
10:53:58.414136|tcp|203.0.113.55|48471|10.20.6.40|22|S|1569168890|64240|0|
10:53:58.415323|tcp|10.20.6.40|22|203.0.113.55|48471|S.|600758006|65535|0|
10:53:58.416411|tcp|203.0.113.55|48471|10.20.6.40|22|.|1569168891|64240|0|
10:53:58.426929|tcp|203.0.113.55|48471|10.20.6.40|22|P.|1569168891|64240|225|SSH-2.0-libssh2_1.10.0
10:53:58.431972|tcp|10.20.6.40|22|203.0.113.55|48471|P.|600758007|65535|374|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:53:58.432272|tcp|203.0.113.55|48471|10.20.6.40|22|.|1569169116|64240|0|
10:53:58.479157|tcp|203.0.113.55|48471|10.20.6.40|22|P.|1569169116|64240|179|
10:53:58.482267|tcp|10.20.6.40|22|203.0.113.55|48471|P.|600758381|65535|542|
10:53:58.482567|tcp|203.0.113.55|48471|10.20.6.40|22|.|1569169295|64240|0|
10:53:58.502567|tcp|203.0.113.55|48471|10.20.6.40|22|F.|1569169295|64240|0|
10:53:58.503067|tcp|10.20.6.40|22|203.0.113.55|48471|F.|600758923|65535|0|
10:53:58.503267|tcp|203.0.113.55|48471|10.20.6.40|22|.|1569169296|64240|0|
10:54:00.307459|tcp|203.0.113.55|34873|10.20.6.40|22|S|1834885431|29200|0|
10:54:00.308634|tcp|10.20.6.40|22|203.0.113.55|34873|S.|1120436150|65535|0|
10:54:00.309750|tcp|203.0.113.55|34873|10.20.6.40|22|.|1834885432|29200|0|
10:54:00.329150|tcp|203.0.113.55|34873|10.20.6.40|22|P.|1834885432|29200|254|SSH-2.0-libssh2_1.10.0
10:54:00.332780|tcp|10.20.6.40|22|203.0.113.55|34873|P.|1120436151|65535|516|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:54:00.333080|tcp|203.0.113.55|34873|10.20.6.40|22|.|1834885686|29200|0|
10:54:00.354114|tcp|203.0.113.55|34873|10.20.6.40|22|P.|1834885686|29200|172|
10:54:00.355810|tcp|10.20.6.40|22|203.0.113.55|34873|P.|1120436667|65535|390|
10:54:00.356110|tcp|203.0.113.55|34873|10.20.6.40|22|.|1834885858|29200|0|
10:54:00.376110|tcp|203.0.113.55|34873|10.20.6.40|22|F.|1834885858|29200|0|
10:54:00.376610|tcp|10.20.6.40|22|203.0.113.55|34873|F.|1120437057|65535|0|
10:54:00.376810|tcp|203.0.113.55|34873|10.20.6.40|22|.|1834885859|29200|0|
10:54:04.487766|tcp|203.0.113.55|42804|10.20.6.40|22|S|1379396332|65535|0|
10:54:04.488327|tcp|10.20.6.40|22|203.0.113.55|42804|S.|3196024566|62720|0|
10:54:04.488762|tcp|203.0.113.55|42804|10.20.6.40|22|.|1379396333|65535|0|
10:54:04.541786|tcp|203.0.113.55|42804|10.20.6.40|22|P.|1379396333|65535|219|SSH-2.0-libssh2_1.10.0
10:54:04.546125|tcp|10.20.6.40|22|203.0.113.55|42804|P.|3196024567|62720|456|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:54:04.546425|tcp|203.0.113.55|42804|10.20.6.40|22|.|1379396552|65535|0|
10:54:04.577336|tcp|203.0.113.55|42804|10.20.6.40|22|P.|1379396552|65535|282|
10:54:04.579661|tcp|10.20.6.40|22|203.0.113.55|42804|P.|3196025023|62720|383|
10:54:04.579961|tcp|203.0.113.55|42804|10.20.6.40|22|.|1379396834|65535|0|
10:54:04.599961|tcp|203.0.113.55|42804|10.20.6.40|22|F.|1379396834|65535|0|
10:54:04.600461|tcp|10.20.6.40|22|203.0.113.55|42804|F.|3196025406|62720|0|
10:54:04.600661|tcp|203.0.113.55|42804|10.20.6.40|22|.|1379396835|65535|0|
10:54:07.000000|tcp|10.20.9.40|40884|10.20.6.40|9100|S|1396848755|64240|0|
10:54:07.000931|tcp|10.20.6.40|9100|10.20.9.40|40884|S.|2547096574|64240|0|
10:54:07.001417|tcp|10.20.9.40|40884|10.20.6.40|9100|.|1396848756|64240|0|
10:54:07.045149|tcp|10.20.9.40|40884|10.20.6.40|9100|P.|1396848756|64240|512|GET /metrics HTTP/1.1
10:54:07.047729|tcp|10.20.6.40|9100|10.20.9.40|40884|P.|2547096575|64240|1207|
10:54:07.048029|tcp|10.20.9.40|40884|10.20.6.40|9100|.|1396849268|64240|0|
10:54:07.068029|tcp|10.20.9.40|40884|10.20.6.40|9100|F.|1396849268|64240|0|
10:54:07.068529|tcp|10.20.6.40|9100|10.20.9.40|40884|F.|2547097782|64240|0|
10:54:07.068729|tcp|10.20.9.40|40884|10.20.6.40|9100|.|1396849269|64240|0|
10:54:07.838790|udp|10.20.6.40|57146|10.20.1.10|53|q|17781|0|44|17781+ A? www.example.com.
10:54:07.842752|udp|10.20.1.10|53|10.20.6.40|57146|r|17781|0|60|17781 1/0/0 A 192.0.2.10
10:54:22.606450|tcp|203.0.113.55|45625|10.20.6.40|22|S|2547718140|62720|0|
10:54:22.607779|tcp|10.20.6.40|22|203.0.113.55|45625|S.|447945855|64240|0|
10:54:22.608126|tcp|203.0.113.55|45625|10.20.6.40|22|.|2547718141|62720|0|
10:54:22.647124|tcp|203.0.113.55|45625|10.20.6.40|22|P.|2547718141|62720|296|SSH-2.0-libssh2_1.10.0
10:54:22.650838|tcp|10.20.6.40|22|203.0.113.55|45625|P.|447945856|64240|281|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:54:22.651138|tcp|203.0.113.55|45625|10.20.6.40|22|.|2547718437|62720|0|
10:54:22.679042|tcp|203.0.113.55|45625|10.20.6.40|22|P.|2547718437|62720|292|
10:54:22.684978|tcp|10.20.6.40|22|203.0.113.55|45625|P.|447946137|64240|170|
10:54:22.685278|tcp|203.0.113.55|45625|10.20.6.40|22|.|2547718729|62720|0|
10:54:22.705278|tcp|203.0.113.55|45625|10.20.6.40|22|F.|2547718729|62720|0|
10:54:22.705778|tcp|10.20.6.40|22|203.0.113.55|45625|F.|447946307|64240|0|
10:54:22.705978|tcp|203.0.113.55|45625|10.20.6.40|22|.|2547718730|62720|0|
10:54:28.491835|tcp|203.0.113.55|45830|10.20.6.40|22|S|2026206984|64240|0|
10:54:28.493091|tcp|10.20.6.40|22|203.0.113.55|45830|S.|283856880|62720|0|
10:54:28.493477|tcp|203.0.113.55|45830|10.20.6.40|22|.|2026206985|64240|0|
10:54:28.550576|tcp|203.0.113.55|45830|10.20.6.40|22|P.|2026206985|64240|200|SSH-2.0-libssh2_1.10.0
10:54:28.553951|tcp|10.20.6.40|22|203.0.113.55|45830|P.|283856881|62720|392|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:54:28.554251|tcp|203.0.113.55|45830|10.20.6.40|22|.|2026207185|64240|0|
10:54:28.600496|tcp|203.0.113.55|45830|10.20.6.40|22|P.|2026207185|64240|166|
10:54:28.605180|tcp|10.20.6.40|22|203.0.113.55|45830|P.|283857273|62720|446|
10:54:28.605480|tcp|203.0.113.55|45830|10.20.6.40|22|.|2026207351|64240|0|
10:54:28.625480|tcp|203.0.113.55|45830|10.20.6.40|22|F.|2026207351|64240|0|
10:54:28.625980|tcp|10.20.6.40|22|203.0.113.55|45830|F.|283857719|62720|0|
10:54:28.626180|tcp|203.0.113.55|45830|10.20.6.40|22|.|2026207352|64240|0|
10:54:30.359686|tcp|203.0.113.55|42654|10.20.6.40|22|S|305516191|62720|0|
10:54:30.360219|tcp|10.20.6.40|22|203.0.113.55|42654|S.|93007394|29200|0|
10:54:30.360528|tcp|203.0.113.55|42654|10.20.6.40|22|.|305516192|62720|0|
10:54:30.390471|tcp|203.0.113.55|42654|10.20.6.40|22|P.|305516192|62720|252|SSH-2.0-libssh2_1.10.0
10:54:30.393973|tcp|10.20.6.40|22|203.0.113.55|42654|P.|93007395|29200|313|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:54:30.394273|tcp|203.0.113.55|42654|10.20.6.40|22|.|305516444|62720|0|
10:54:30.449616|tcp|203.0.113.55|42654|10.20.6.40|22|P.|305516444|62720|157|
10:54:30.455193|tcp|10.20.6.40|22|203.0.113.55|42654|P.|93007708|29200|375|
10:54:30.455493|tcp|203.0.113.55|42654|10.20.6.40|22|.|305516601|62720|0|
10:54:30.475493|tcp|203.0.113.55|42654|10.20.6.40|22|F.|305516601|62720|0|
10:54:30.475993|tcp|10.20.6.40|22|203.0.113.55|42654|F.|93008083|29200|0|
10:54:30.476193|tcp|203.0.113.55|42654|10.20.6.40|22|.|305516602|62720|0|
10:54:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 28
10:54:31.000790|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 28
10:54:40.870373|tcp|203.0.113.55|59475|10.20.6.40|22|S|882016448|62720|0|
10:54:40.871707|tcp|10.20.6.40|22|203.0.113.55|59475|S.|184123744|64240|0|
10:54:40.872406|tcp|203.0.113.55|59475|10.20.6.40|22|.|882016449|62720|0|
10:54:40.923638|tcp|203.0.113.55|59475|10.20.6.40|22|P.|882016449|62720|204|SSH-2.0-libssh2_1.10.0
10:54:40.924941|tcp|10.20.6.40|22|203.0.113.55|59475|P.|184123745|64240|427|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:54:40.925241|tcp|203.0.113.55|59475|10.20.6.40|22|.|882016653|62720|0|
10:54:40.970815|tcp|203.0.113.55|59475|10.20.6.40|22|P.|882016653|62720|229|
10:54:40.973391|tcp|10.20.6.40|22|203.0.113.55|59475|P.|184124172|64240|586|
10:54:40.973691|tcp|203.0.113.55|59475|10.20.6.40|22|.|882016882|62720|0|
10:54:40.993691|tcp|203.0.113.55|59475|10.20.6.40|22|F.|882016882|62720|0|
10:54:40.994191|tcp|10.20.6.40|22|203.0.113.55|59475|F.|184124758|64240|0|
10:54:40.994391|tcp|203.0.113.55|59475|10.20.6.40|22|.|882016883|62720|0|
10:54:48.813916|tcp|203.0.113.55|47650|10.20.6.40|22|S|2562412164|65535|0|
10:54:48.814410|tcp|10.20.6.40|22|203.0.113.55|47650|S.|3211276337|65535|0|
10:54:48.815054|tcp|203.0.113.55|47650|10.20.6.40|22|.|2562412165|65535|0|
10:54:48.854568|tcp|203.0.113.55|47650|10.20.6.40|22|P.|2562412165|65535|290|SSH-2.0-libssh2_1.10.0
10:54:48.856012|tcp|10.20.6.40|22|203.0.113.55|47650|P.|3211276338|65535|598|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:54:48.856312|tcp|203.0.113.55|47650|10.20.6.40|22|.|2562412455|65535|0|
10:54:48.886488|tcp|203.0.113.55|47650|10.20.6.40|22|P.|2562412455|65535|150|
10:54:48.891427|tcp|10.20.6.40|22|203.0.113.55|47650|P.|3211276936|65535|399|
10:54:48.891727|tcp|203.0.113.55|47650|10.20.6.40|22|.|2562412605|65535|0|
10:54:48.911727|tcp|203.0.113.55|47650|10.20.6.40|22|F.|2562412605|65535|0|
10:54:48.912227|tcp|10.20.6.40|22|203.0.113.55|47650|F.|3211277335|65535|0|
10:54:48.912427|tcp|203.0.113.55|47650|10.20.6.40|22|.|2562412606|65535|0|
10:54:50.900761|tcp|203.0.113.55|41447|10.20.6.40|22|S|1513496911|65535|0|
10:54:50.902029|tcp|10.20.6.40|22|203.0.113.55|41447|S.|3687239334|62720|0|
10:54:50.902674|tcp|203.0.113.55|41447|10.20.6.40|22|.|1513496912|65535|0|
10:54:50.934334|tcp|203.0.113.55|41447|10.20.6.40|22|P.|1513496912|65535|165|SSH-2.0-libssh2_1.10.0
10:54:50.936950|tcp|10.20.6.40|22|203.0.113.55|41447|P.|3687239335|62720|202|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:54:50.937250|tcp|203.0.113.55|41447|10.20.6.40|22|.|1513497077|65535|0|
10:54:50.985664|tcp|203.0.113.55|41447|10.20.6.40|22|P.|1513497077|65535|220|
10:54:50.991552|tcp|10.20.6.40|22|203.0.113.55|41447|P.|3687239537|62720|164|
10:54:50.991852|tcp|203.0.113.55|41447|10.20.6.40|22|.|1513497297|65535|0|
10:54:51.011852|tcp|203.0.113.55|41447|10.20.6.40|22|F.|1513497297|65535|0|
10:54:51.012352|tcp|10.20.6.40|22|203.0.113.55|41447|F.|3687239701|62720|0|
10:54:51.012552|tcp|203.0.113.55|41447|10.20.6.40|22|.|1513497298|65535|0|
10:54:52.594966|udp|10.20.6.40|58446|10.20.1.10|53|q|17482|0|40|17482+ A? example.com.
10:54:52.597060|udp|10.20.1.10|53|10.20.6.40|58446|r|17482|0|56|17482 1/0/0 A 192.0.2.10
10:55:00.426156|tcp|203.0.113.55|52037|10.20.6.40|22|S|687983043|65535|0|
10:55:00.426824|tcp|10.20.6.40|22|203.0.113.55|52037|S.|1509325507|65535|0|
10:55:00.427312|tcp|203.0.113.55|52037|10.20.6.40|22|.|687983044|65535|0|
10:55:00.477789|tcp|203.0.113.55|52037|10.20.6.40|22|P.|687983044|65535|158|SSH-2.0-libssh2_1.10.0
10:55:00.479484|tcp|10.20.6.40|22|203.0.113.55|52037|P.|1509325508|65535|524|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:55:00.479784|tcp|203.0.113.55|52037|10.20.6.40|22|.|687983202|65535|0|
10:55:00.511843|tcp|203.0.113.55|52037|10.20.6.40|22|P.|687983202|65535|165|
10:55:00.516078|tcp|10.20.6.40|22|203.0.113.55|52037|P.|1509326032|65535|152|
10:55:00.516378|tcp|203.0.113.55|52037|10.20.6.40|22|.|687983367|65535|0|
10:55:00.536378|tcp|203.0.113.55|52037|10.20.6.40|22|F.|687983367|65535|0|
10:55:00.536878|tcp|10.20.6.40|22|203.0.113.55|52037|F.|1509326184|65535|0|
10:55:00.537078|tcp|203.0.113.55|52037|10.20.6.40|22|.|687983368|65535|0|
10:55:07.000000|tcp|10.20.9.40|51085|10.20.6.40|9100|S|3643693343|65535|0|
10:55:07.001290|tcp|10.20.6.40|9100|10.20.9.40|51085|S.|3404305663|64240|0|
10:55:07.002357|tcp|10.20.9.40|51085|10.20.6.40|9100|.|3643693344|65535|0|
10:55:07.027767|tcp|10.20.9.40|51085|10.20.6.40|9100|P.|3643693344|65535|810|GET /metrics HTTP/1.1
10:55:07.031199|tcp|10.20.6.40|9100|10.20.9.40|51085|P.|3404305664|64240|844|
10:55:07.031499|tcp|10.20.9.40|51085|10.20.6.40|9100|.|3643694154|65535|0|
10:55:07.051499|tcp|10.20.9.40|51085|10.20.6.40|9100|F.|3643694154|65535|0|
10:55:07.051999|tcp|10.20.6.40|9100|10.20.9.40|51085|F.|3404306508|64240|0|
10:55:07.052199|tcp|10.20.9.40|51085|10.20.6.40|9100|.|3643694155|65535|0|
10:55:15.645930|tcp|203.0.113.55|37368|10.20.6.40|22|S|2443181802|29200|0|
10:55:15.646961|tcp|10.20.6.40|22|203.0.113.55|37368|S.|3826302879|62720|0|
10:55:15.647217|tcp|203.0.113.55|37368|10.20.6.40|22|.|2443181803|29200|0|
10:55:15.670490|tcp|203.0.113.55|37368|10.20.6.40|22|P.|2443181803|29200|228|SSH-2.0-libssh2_1.10.0
10:55:15.674714|tcp|10.20.6.40|22|203.0.113.55|37368|P.|3826302880|62720|545|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:55:15.675014|tcp|203.0.113.55|37368|10.20.6.40|22|.|2443182031|29200|0|
10:55:15.687625|tcp|203.0.113.55|37368|10.20.6.40|22|P.|2443182031|29200|210|
10:55:15.688783|tcp|10.20.6.40|22|203.0.113.55|37368|P.|3826303425|62720|443|
10:55:15.689083|tcp|203.0.113.55|37368|10.20.6.40|22|.|2443182241|29200|0|
10:55:15.709083|tcp|203.0.113.55|37368|10.20.6.40|22|F.|2443182241|29200|0|
10:55:15.709583|tcp|10.20.6.40|22|203.0.113.55|37368|F.|3826303868|62720|0|
10:55:15.709783|tcp|203.0.113.55|37368|10.20.6.40|22|.|2443182242|29200|0|
10:55:34.430845|tcp|10.20.4.12|54187|10.20.6.40|443|S|1780842033|64240|0|
10:55:34.431388|tcp|10.20.6.40|443|10.20.4.12|54187|S.|1613017386|62720|0|
10:55:34.431992|tcp|10.20.4.12|54187|10.20.6.40|443|.|1780842034|64240|0|
10:55:34.470749|tcp|10.20.4.12|54187|10.20.6.40|443|P.|1780842034|64240|1183|TLS SNI: portal.ridgelinemed.example
10:55:34.472940|tcp|10.20.6.40|443|10.20.4.12|54187|P.|1613017387|62720|1895|
10:55:34.473240|tcp|10.20.4.12|54187|10.20.6.40|443|.|1780843217|64240|0|
10:55:34.526167|tcp|10.20.4.12|54187|10.20.6.40|443|P.|1780843217|64240|1066|
10:55:34.529284|tcp|10.20.6.40|443|10.20.4.12|54187|P.|1613019282|62720|1668|
10:55:34.529584|tcp|10.20.4.12|54187|10.20.6.40|443|.|1780844283|64240|0|
10:55:34.572563|tcp|10.20.4.12|54187|10.20.6.40|443|P.|1780844283|64240|1166|
10:55:34.575881|tcp|10.20.6.40|443|10.20.4.12|54187|P.|1613020950|62720|2236|
10:55:34.576181|tcp|10.20.4.12|54187|10.20.6.40|443|.|1780845449|64240|0|
10:55:34.596181|tcp|10.20.4.12|54187|10.20.6.40|443|F.|1780845449|64240|0|
10:55:34.596681|tcp|10.20.6.40|443|10.20.4.12|54187|F.|1613023186|62720|0|
10:55:34.596881|tcp|10.20.4.12|54187|10.20.6.40|443|.|1780845450|64240|0|
10:55:36.734395|tcp|203.0.113.55|60139|10.20.6.40|22|S|3582623901|62720|0|
10:55:36.735628|tcp|10.20.6.40|22|203.0.113.55|60139|S.|250917266|62720|0|
10:55:36.736026|tcp|203.0.113.55|60139|10.20.6.40|22|.|3582623902|62720|0|
10:55:36.781412|tcp|203.0.113.55|60139|10.20.6.40|22|P.|3582623902|62720|296|SSH-2.0-libssh2_1.10.0
10:55:36.786255|tcp|10.20.6.40|22|203.0.113.55|60139|P.|250917267|62720|358|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:55:36.786555|tcp|203.0.113.55|60139|10.20.6.40|22|.|3582624198|62720|0|
10:55:36.815646|tcp|203.0.113.55|60139|10.20.6.40|22|P.|3582624198|62720|299|
10:55:36.819709|tcp|10.20.6.40|22|203.0.113.55|60139|P.|250917625|62720|419|
10:55:36.820009|tcp|203.0.113.55|60139|10.20.6.40|22|.|3582624497|62720|0|
10:55:36.840009|tcp|203.0.113.55|60139|10.20.6.40|22|F.|3582624497|62720|0|
10:55:36.840509|tcp|10.20.6.40|22|203.0.113.55|60139|F.|250918044|62720|0|
10:55:36.840709|tcp|203.0.113.55|60139|10.20.6.40|22|.|3582624498|62720|0|
10:55:50.480455|udp|10.20.6.40|45150|10.20.1.10|53|q|13651|0|63|13651+ A? rmg-backup-01.ridgelinemed.example.
10:55:50.482471|udp|10.20.1.10|53|10.20.6.40|45150|r|13651|0|79|13651 1/0/0 A 10.20.9.15
10:55:59.970950|tcp|203.0.113.55|33038|10.20.6.40|22|S|1916133451|64240|0|
10:55:59.972112|tcp|10.20.6.40|22|203.0.113.55|33038|S.|3204335058|65535|0|
10:55:59.972363|tcp|203.0.113.55|33038|10.20.6.40|22|.|1916133452|64240|0|
10:56:00.002685|tcp|203.0.113.55|33038|10.20.6.40|22|P.|1916133452|64240|218|SSH-2.0-libssh2_1.10.0
10:56:00.004017|tcp|10.20.6.40|22|203.0.113.55|33038|P.|3204335059|65535|352|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:56:00.004317|tcp|203.0.113.55|33038|10.20.6.40|22|.|1916133670|64240|0|
10:56:00.052257|tcp|203.0.113.55|33038|10.20.6.40|22|P.|1916133670|64240|210|
10:56:00.057230|tcp|10.20.6.40|22|203.0.113.55|33038|P.|3204335411|65535|359|
10:56:00.057530|tcp|203.0.113.55|33038|10.20.6.40|22|.|1916133880|64240|0|
10:56:00.077530|tcp|203.0.113.55|33038|10.20.6.40|22|F.|1916133880|64240|0|
10:56:00.078030|tcp|10.20.6.40|22|203.0.113.55|33038|F.|3204335770|65535|0|
10:56:00.078230|tcp|203.0.113.55|33038|10.20.6.40|22|.|1916133881|64240|0|
10:56:07.000000|tcp|10.20.9.40|52568|10.20.6.40|9100|S|1229228176|65535|0|
10:56:07.001220|tcp|10.20.6.40|9100|10.20.9.40|52568|S.|1890657395|29200|0|
10:56:07.002236|tcp|10.20.9.40|52568|10.20.6.40|9100|.|1229228177|65535|0|
10:56:07.041528|tcp|10.20.9.40|52568|10.20.6.40|9100|P.|1229228177|65535|890|GET /metrics HTTP/1.1
10:56:07.047232|tcp|10.20.6.40|9100|10.20.9.40|52568|P.|1890657396|29200|1481|
10:56:07.047532|tcp|10.20.9.40|52568|10.20.6.40|9100|.|1229229067|65535|0|
10:56:07.067532|tcp|10.20.9.40|52568|10.20.6.40|9100|F.|1229229067|65535|0|
10:56:07.068032|tcp|10.20.6.40|9100|10.20.9.40|52568|F.|1890658877|29200|0|
10:56:07.068232|tcp|10.20.9.40|52568|10.20.6.40|9100|.|1229229068|65535|0|
10:56:28.329143|udp|10.20.6.40|53329|10.20.1.10|53|q|3769|0|63|3769+ A? rmg-backup-01.ridgelinemed.example.
10:56:28.331736|udp|10.20.1.10|53|10.20.6.40|53329|r|3769|0|79|3769 1/0/0 A 10.20.9.15
10:56:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 29
10:56:31.000476|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 29
10:56:40.961067|tcp|203.0.113.55|40397|10.20.6.40|22|S|1836964196|62720|0|
10:56:40.961988|tcp|10.20.6.40|22|203.0.113.55|40397|S.|3398728972|64240|0|
10:56:40.962274|tcp|203.0.113.55|40397|10.20.6.40|22|.|1836964197|62720|0|
10:56:41.016065|tcp|203.0.113.55|40397|10.20.6.40|22|P.|1836964197|62720|181|SSH-2.0-libssh2_1.10.0
10:56:41.018275|tcp|10.20.6.40|22|203.0.113.55|40397|P.|3398728973|64240|185|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:56:41.018575|tcp|203.0.113.55|40397|10.20.6.40|22|.|1836964378|62720|0|
10:56:41.040947|tcp|203.0.113.55|40397|10.20.6.40|22|P.|1836964378|62720|300|
10:56:41.046219|tcp|10.20.6.40|22|203.0.113.55|40397|P.|3398729158|64240|336|
10:56:41.046519|tcp|203.0.113.55|40397|10.20.6.40|22|.|1836964678|62720|0|
10:56:41.066519|tcp|203.0.113.55|40397|10.20.6.40|22|F.|1836964678|62720|0|
10:56:41.067019|tcp|10.20.6.40|22|203.0.113.55|40397|F.|3398729494|64240|0|
10:56:41.067219|tcp|203.0.113.55|40397|10.20.6.40|22|.|1836964679|62720|0|
10:56:54.107779|tcp|203.0.113.55|36449|10.20.6.40|22|S|270735003|65535|0|
10:56:54.109151|tcp|10.20.6.40|22|203.0.113.55|36449|S.|3871724022|29200|0|
10:56:54.109842|tcp|203.0.113.55|36449|10.20.6.40|22|.|270735004|65535|0|
10:56:54.125922|tcp|203.0.113.55|36449|10.20.6.40|22|P.|270735004|65535|225|SSH-2.0-libssh2_1.10.0
10:56:54.131549|tcp|10.20.6.40|22|203.0.113.55|36449|P.|3871724023|29200|201|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:56:54.131849|tcp|203.0.113.55|36449|10.20.6.40|22|.|270735229|65535|0|
10:56:54.158893|tcp|203.0.113.55|36449|10.20.6.40|22|P.|270735229|65535|192|
10:56:54.161810|tcp|10.20.6.40|22|203.0.113.55|36449|P.|3871724224|29200|521|
10:56:54.162110|tcp|203.0.113.55|36449|10.20.6.40|22|.|270735421|65535|0|
10:56:54.182110|tcp|203.0.113.55|36449|10.20.6.40|22|F.|270735421|65535|0|
10:56:54.182610|tcp|10.20.6.40|22|203.0.113.55|36449|F.|3871724745|29200|0|
10:56:54.182810|tcp|203.0.113.55|36449|10.20.6.40|22|.|270735422|65535|0|
10:57:07.000000|tcp|10.20.9.40|33988|10.20.6.40|9100|S|671616070|64240|0|
10:57:07.001078|tcp|10.20.6.40|9100|10.20.9.40|33988|S.|337392693|29200|0|
10:57:07.001992|tcp|10.20.9.40|33988|10.20.6.40|9100|.|671616071|64240|0|
10:57:07.050459|tcp|10.20.9.40|33988|10.20.6.40|9100|P.|671616071|64240|882|GET /metrics HTTP/1.1
10:57:07.053582|tcp|10.20.6.40|9100|10.20.9.40|33988|P.|337392694|29200|767|
10:57:07.053882|tcp|10.20.9.40|33988|10.20.6.40|9100|.|671616953|64240|0|
10:57:07.073882|tcp|10.20.9.40|33988|10.20.6.40|9100|F.|671616953|64240|0|
10:57:07.074382|tcp|10.20.6.40|9100|10.20.9.40|33988|F.|337393461|29200|0|
10:57:07.074582|tcp|10.20.9.40|33988|10.20.6.40|9100|.|671616954|64240|0|
10:57:27.681712|tcp|203.0.113.55|49818|10.20.6.40|22|S|2659274576|64240|0|
10:57:27.683056|tcp|10.20.6.40|22|203.0.113.55|49818|S.|906269871|29200|0|
10:57:27.683499|tcp|203.0.113.55|49818|10.20.6.40|22|.|2659274577|64240|0|
10:57:27.695350|tcp|203.0.113.55|49818|10.20.6.40|22|P.|2659274577|64240|162|SSH-2.0-libssh2_1.10.0
10:57:27.699593|tcp|10.20.6.40|22|203.0.113.55|49818|P.|906269872|29200|528|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:57:27.699893|tcp|203.0.113.55|49818|10.20.6.40|22|.|2659274739|64240|0|
10:57:27.713944|tcp|203.0.113.55|49818|10.20.6.40|22|P.|2659274739|64240|263|
10:57:27.716875|tcp|10.20.6.40|22|203.0.113.55|49818|P.|906270400|29200|498|
10:57:27.717175|tcp|203.0.113.55|49818|10.20.6.40|22|.|2659275002|64240|0|
10:57:27.737175|tcp|203.0.113.55|49818|10.20.6.40|22|F.|2659275002|64240|0|
10:57:27.737675|tcp|10.20.6.40|22|203.0.113.55|49818|F.|906270898|29200|0|
10:57:27.737875|tcp|203.0.113.55|49818|10.20.6.40|22|.|2659275003|64240|0|
10:57:31.056041|udp|10.20.6.40|48173|10.20.1.10|53|q|50069|0|64|50069+ A? rmg-monitor-01.ridgelinemed.example.
10:57:31.059497|udp|10.20.1.10|53|10.20.6.40|48173|r|50069|0|80|50069 1/0/0 A 10.20.9.40
10:57:35.405425|tcp|10.20.6.40|42152|192.0.2.10|443|S|671641582|64240|0|
10:57:35.406494|tcp|192.0.2.10|443|10.20.6.40|42152|S.|2432894215|62720|0|
10:57:35.407159|tcp|10.20.6.40|42152|192.0.2.10|443|.|671641583|64240|0|
10:57:35.464504|tcp|10.20.6.40|42152|192.0.2.10|443|P.|671641583|64240|798|TLS SNI: www.example.com
10:57:35.470403|tcp|192.0.2.10|443|10.20.6.40|42152|P.|2432894216|62720|2082|
10:57:35.470703|tcp|10.20.6.40|42152|192.0.2.10|443|.|671642381|64240|0|
10:57:35.501548|tcp|10.20.6.40|42152|192.0.2.10|443|P.|671642381|64240|902|
10:57:35.504570|tcp|192.0.2.10|443|10.20.6.40|42152|P.|2432896298|62720|2105|
10:57:35.504870|tcp|10.20.6.40|42152|192.0.2.10|443|.|671643283|64240|0|
10:57:35.542543|tcp|10.20.6.40|42152|192.0.2.10|443|P.|671643283|64240|958|
10:57:35.548182|tcp|192.0.2.10|443|10.20.6.40|42152|P.|2432898403|62720|2309|
10:57:35.548482|tcp|10.20.6.40|42152|192.0.2.10|443|.|671644241|64240|0|
10:57:35.568347|tcp|10.20.6.40|42152|192.0.2.10|443|P.|671644241|64240|758|
10:57:35.571826|tcp|192.0.2.10|443|10.20.6.40|42152|P.|2432900712|62720|2207|
10:57:35.572126|tcp|10.20.6.40|42152|192.0.2.10|443|.|671644999|64240|0|
10:57:35.595241|tcp|10.20.6.40|42152|192.0.2.10|443|P.|671644999|64240|682|
10:57:35.597136|tcp|192.0.2.10|443|10.20.6.40|42152|P.|2432902919|62720|678|
10:57:35.597436|tcp|10.20.6.40|42152|192.0.2.10|443|.|671645681|64240|0|
10:57:35.617436|tcp|10.20.6.40|42152|192.0.2.10|443|F.|671645681|64240|0|
10:57:35.617936|tcp|192.0.2.10|443|10.20.6.40|42152|F.|2432903597|62720|0|
10:57:35.618136|tcp|10.20.6.40|42152|192.0.2.10|443|.|671645682|64240|0|
10:58:07.000000|tcp|10.20.9.40|47218|10.20.6.40|9100|S|773907673|64240|0|
10:58:07.000908|tcp|10.20.6.40|9100|10.20.9.40|47218|S.|1277898742|64240|0|
10:58:07.001629|tcp|10.20.9.40|47218|10.20.6.40|9100|.|773907674|64240|0|
10:58:07.023423|tcp|10.20.9.40|47218|10.20.6.40|9100|P.|773907674|64240|723|GET /metrics HTTP/1.1
10:58:07.028089|tcp|10.20.6.40|9100|10.20.9.40|47218|P.|1277898743|64240|1792|
10:58:07.028389|tcp|10.20.9.40|47218|10.20.6.40|9100|.|773908397|64240|0|
10:58:07.048389|tcp|10.20.9.40|47218|10.20.6.40|9100|F.|773908397|64240|0|
10:58:07.048889|tcp|10.20.6.40|9100|10.20.9.40|47218|F.|1277900535|64240|0|
10:58:07.049089|tcp|10.20.9.40|47218|10.20.6.40|9100|.|773908398|64240|0|
10:58:12.018016|tcp|203.0.113.55|55960|10.20.6.40|22|S|2272923417|64240|0|
10:58:12.019256|tcp|10.20.6.40|22|203.0.113.55|55960|S.|2254478056|65535|0|
10:58:12.020011|tcp|203.0.113.55|55960|10.20.6.40|22|.|2272923418|64240|0|
10:58:12.046987|tcp|203.0.113.55|55960|10.20.6.40|22|P.|2272923418|64240|178|SSH-2.0-libssh2_1.10.0
10:58:12.051312|tcp|10.20.6.40|22|203.0.113.55|55960|P.|2254478057|65535|484|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:58:12.051612|tcp|203.0.113.55|55960|10.20.6.40|22|.|2272923596|64240|0|
10:58:12.073237|tcp|203.0.113.55|55960|10.20.6.40|22|P.|2272923596|64240|237|
10:58:12.074257|tcp|10.20.6.40|22|203.0.113.55|55960|P.|2254478541|65535|455|
10:58:12.074557|tcp|203.0.113.55|55960|10.20.6.40|22|.|2272923833|64240|0|
10:58:12.094557|tcp|203.0.113.55|55960|10.20.6.40|22|F.|2272923833|64240|0|
10:58:12.095057|tcp|10.20.6.40|22|203.0.113.55|55960|F.|2254478996|65535|0|
10:58:12.095257|tcp|203.0.113.55|55960|10.20.6.40|22|.|2272923834|64240|0|
10:58:16.605486|udp|10.20.6.40|45536|10.20.1.10|53|q|61141|0|39|61141+ A? ubuntu.com.
10:58:16.608455|udp|10.20.1.10|53|10.20.6.40|45536|r|61141|0|55|61141 1/0/0 A 192.0.2.30
10:58:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 30
10:58:31.000734|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 30
10:58:48.705769|tcp|203.0.113.55|43406|10.20.6.40|22|S|788537255|29200|0|
10:58:48.707018|tcp|10.20.6.40|22|203.0.113.55|43406|S.|3676614195|29200|0|
10:58:48.707289|tcp|203.0.113.55|43406|10.20.6.40|22|.|788537256|29200|0|
10:58:48.764768|tcp|203.0.113.55|43406|10.20.6.40|22|P.|788537256|29200|230|SSH-2.0-libssh2_1.10.0
10:58:48.767588|tcp|10.20.6.40|22|203.0.113.55|43406|P.|3676614196|29200|423|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:58:48.767888|tcp|203.0.113.55|43406|10.20.6.40|22|.|788537486|29200|0|
10:58:48.779501|tcp|203.0.113.55|43406|10.20.6.40|22|P.|788537486|29200|225|
10:58:48.783862|tcp|10.20.6.40|22|203.0.113.55|43406|P.|3676614619|29200|557|
10:58:48.784162|tcp|203.0.113.55|43406|10.20.6.40|22|.|788537711|29200|0|
10:58:48.804162|tcp|203.0.113.55|43406|10.20.6.40|22|F.|788537711|29200|0|
10:58:48.804662|tcp|10.20.6.40|22|203.0.113.55|43406|F.|3676615176|29200|0|
10:58:48.804862|tcp|203.0.113.55|43406|10.20.6.40|22|.|788537712|29200|0|
10:59:01.866015|udp|10.20.6.40|42974|10.20.1.10|53|q|2037|0|56|2037+ A? portal.ridgelinemed.example.
10:59:01.868109|udp|10.20.1.10|53|10.20.6.40|42974|r|2037|0|72|2037 1/0/0 A 10.20.6.40
10:59:01.953501|tcp|10.20.4.12|45509|10.20.6.40|443|S|889708637|64240|0|
10:59:01.954456|tcp|10.20.6.40|443|10.20.4.12|45509|S.|3697647681|29200|0|
10:59:01.955626|tcp|10.20.4.12|45509|10.20.6.40|443|.|889708638|64240|0|
10:59:01.982918|tcp|10.20.4.12|45509|10.20.6.40|443|P.|889708638|64240|1212|TLS SNI: portal.ridgelinemed.example
10:59:01.985599|tcp|10.20.6.40|443|10.20.4.12|45509|P.|3697647682|29200|2159|
10:59:01.985899|tcp|10.20.4.12|45509|10.20.6.40|443|.|889709850|64240|0|
10:59:02.035610|tcp|10.20.4.12|45509|10.20.6.40|443|P.|889709850|64240|906|
10:59:02.040921|tcp|10.20.6.40|443|10.20.4.12|45509|P.|3697649841|29200|1508|
10:59:02.041221|tcp|10.20.4.12|45509|10.20.6.40|443|.|889710756|64240|0|
10:59:02.087281|tcp|10.20.4.12|45509|10.20.6.40|443|P.|889710756|64240|740|
10:59:02.091051|tcp|10.20.6.40|443|10.20.4.12|45509|P.|3697651349|29200|1448|
10:59:02.091351|tcp|10.20.4.12|45509|10.20.6.40|443|.|889711496|64240|0|
10:59:02.149408|tcp|10.20.4.12|45509|10.20.6.40|443|P.|889711496|64240|837|
10:59:02.155347|tcp|10.20.6.40|443|10.20.4.12|45509|P.|3697652797|29200|1386|
10:59:02.155647|tcp|10.20.4.12|45509|10.20.6.40|443|.|889712333|64240|0|
10:59:02.210695|tcp|10.20.4.12|45509|10.20.6.40|443|P.|889712333|64240|1329|
10:59:02.212671|tcp|10.20.6.40|443|10.20.4.12|45509|P.|3697654183|29200|889|
10:59:02.212971|tcp|10.20.4.12|45509|10.20.6.40|443|.|889713662|64240|0|
10:59:02.255832|tcp|10.20.4.12|45509|10.20.6.40|443|P.|889713662|64240|942|
10:59:02.258231|tcp|10.20.6.40|443|10.20.4.12|45509|P.|3697655072|29200|2655|
10:59:02.258531|tcp|10.20.4.12|45509|10.20.6.40|443|.|889714604|64240|0|
10:59:02.291403|tcp|10.20.4.12|45509|10.20.6.40|443|P.|889714604|64240|960|
10:59:02.295196|tcp|10.20.6.40|443|10.20.4.12|45509|P.|3697657727|29200|2699|
10:59:02.295496|tcp|10.20.4.12|45509|10.20.6.40|443|.|889715564|64240|0|
10:59:02.315496|tcp|10.20.4.12|45509|10.20.6.40|443|F.|889715564|64240|0|
10:59:02.315996|tcp|10.20.6.40|443|10.20.4.12|45509|F.|3697660426|29200|0|
10:59:02.316196|tcp|10.20.4.12|45509|10.20.6.40|443|.|889715565|64240|0|
10:59:07.000000|tcp|10.20.9.40|35280|10.20.6.40|9100|S|2008677587|65535|0|
10:59:07.001014|tcp|10.20.6.40|9100|10.20.9.40|35280|S.|689911080|64240|0|
10:59:07.001311|tcp|10.20.9.40|35280|10.20.6.40|9100|.|2008677588|65535|0|
10:59:07.053792|tcp|10.20.9.40|35280|10.20.6.40|9100|P.|2008677588|65535|613|GET /metrics HTTP/1.1
10:59:07.055177|tcp|10.20.6.40|9100|10.20.9.40|35280|P.|689911081|64240|525|
10:59:07.055477|tcp|10.20.9.40|35280|10.20.6.40|9100|.|2008678201|65535|0|
10:59:07.075477|tcp|10.20.9.40|35280|10.20.6.40|9100|F.|2008678201|65535|0|
10:59:07.075977|tcp|10.20.6.40|9100|10.20.9.40|35280|F.|689911606|64240|0|
10:59:07.076177|tcp|10.20.9.40|35280|10.20.6.40|9100|.|2008678202|65535|0|
10:59:08.176159|tcp|203.0.113.55|50200|10.20.6.40|22|S|787151278|65535|0|
10:59:08.176688|tcp|10.20.6.40|22|203.0.113.55|50200|S.|1568740135|29200|0|
10:59:08.177249|tcp|203.0.113.55|50200|10.20.6.40|22|.|787151279|65535|0|
10:59:08.213371|tcp|203.0.113.55|50200|10.20.6.40|22|P.|787151279|65535|207|SSH-2.0-libssh2_1.10.0
10:59:08.215335|tcp|10.20.6.40|22|203.0.113.55|50200|P.|1568740136|29200|344|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:59:08.215635|tcp|203.0.113.55|50200|10.20.6.40|22|.|787151486|65535|0|
10:59:08.248113|tcp|203.0.113.55|50200|10.20.6.40|22|P.|787151486|65535|160|
10:59:08.252123|tcp|10.20.6.40|22|203.0.113.55|50200|P.|1568740480|29200|411|
10:59:08.252423|tcp|203.0.113.55|50200|10.20.6.40|22|.|787151646|65535|0|
10:59:08.272423|tcp|203.0.113.55|50200|10.20.6.40|22|F.|787151646|65535|0|
10:59:08.272923|tcp|10.20.6.40|22|203.0.113.55|50200|F.|1568740891|29200|0|
10:59:08.273123|tcp|203.0.113.55|50200|10.20.6.40|22|.|787151647|65535|0|
10:59:36.595508|tcp|203.0.113.55|52985|10.20.6.40|22|S|3206426989|64240|0|
10:59:36.596457|tcp|10.20.6.40|22|203.0.113.55|52985|S.|1166838529|29200|0|
10:59:36.596817|tcp|203.0.113.55|52985|10.20.6.40|22|.|3206426990|64240|0|
10:59:36.610645|tcp|203.0.113.55|52985|10.20.6.40|22|P.|3206426990|64240|217|SSH-2.0-libssh2_1.10.0
10:59:36.612166|tcp|10.20.6.40|22|203.0.113.55|52985|P.|1166838530|29200|259|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
10:59:36.612466|tcp|203.0.113.55|52985|10.20.6.40|22|.|3206427207|64240|0|
10:59:36.671803|tcp|203.0.113.55|52985|10.20.6.40|22|P.|3206427207|64240|240|
10:59:36.675668|tcp|10.20.6.40|22|203.0.113.55|52985|P.|1166838789|29200|353|
10:59:36.675968|tcp|203.0.113.55|52985|10.20.6.40|22|.|3206427447|64240|0|
10:59:36.695968|tcp|203.0.113.55|52985|10.20.6.40|22|F.|3206427447|64240|0|
10:59:36.696468|tcp|10.20.6.40|22|203.0.113.55|52985|F.|1166839142|29200|0|
10:59:36.696668|tcp|203.0.113.55|52985|10.20.6.40|22|.|3206427448|64240|0|
10:59:55.851115|udp|10.20.6.40|58810|10.20.1.10|53|q|31563|0|63|31563+ A? rmg-backup-01.ridgelinemed.example.
10:59:55.854657|udp|10.20.1.10|53|10.20.6.40|58810|r|31563|0|79|31563 1/0/0 A 10.20.9.15
11:00:07.000000|tcp|10.20.9.40|35348|10.20.6.40|9100|S|132635452|65535|0|
11:00:07.001310|tcp|10.20.6.40|9100|10.20.9.40|35348|S.|1241919233|62720|0|
11:00:07.002364|tcp|10.20.9.40|35348|10.20.6.40|9100|.|132635453|65535|0|
11:00:07.058888|tcp|10.20.9.40|35348|10.20.6.40|9100|P.|132635453|65535|698|GET /metrics HTTP/1.1
11:00:07.062427|tcp|10.20.6.40|9100|10.20.9.40|35348|P.|1241919234|62720|1725|
11:00:07.062727|tcp|10.20.9.40|35348|10.20.6.40|9100|.|132636151|65535|0|
11:00:07.082727|tcp|10.20.9.40|35348|10.20.6.40|9100|F.|132636151|65535|0|
11:00:07.083227|tcp|10.20.6.40|9100|10.20.9.40|35348|F.|1241920959|62720|0|
11:00:07.083427|tcp|10.20.9.40|35348|10.20.6.40|9100|.|132636152|65535|0|
11:00:26.178086|tcp|203.0.113.55|43002|10.20.6.40|22|S|1642611834|65535|0|
11:00:26.178960|tcp|10.20.6.40|22|203.0.113.55|43002|S.|1934852729|65535|0|
11:00:26.179476|tcp|203.0.113.55|43002|10.20.6.40|22|.|1642611835|65535|0|
11:00:26.194971|tcp|203.0.113.55|43002|10.20.6.40|22|P.|1642611835|65535|238|SSH-2.0-libssh2_1.10.0
11:00:26.200868|tcp|10.20.6.40|22|203.0.113.55|43002|P.|1934852730|65535|275|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
11:00:26.201168|tcp|203.0.113.55|43002|10.20.6.40|22|.|1642612073|65535|0|
11:00:26.242686|tcp|203.0.113.55|43002|10.20.6.40|22|P.|1642612073|65535|152|
11:00:26.244938|tcp|10.20.6.40|22|203.0.113.55|43002|P.|1934853005|65535|431|
11:00:26.245238|tcp|203.0.113.55|43002|10.20.6.40|22|.|1642612225|65535|0|
11:00:26.265238|tcp|203.0.113.55|43002|10.20.6.40|22|F.|1642612225|65535|0|
11:00:26.265738|tcp|10.20.6.40|22|203.0.113.55|43002|F.|1934853436|65535|0|
11:00:26.265938|tcp|203.0.113.55|43002|10.20.6.40|22|.|1642612226|65535|0|
11:00:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 31
11:00:31.000545|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 31
11:00:33.222775|udp|10.20.6.40|60905|10.20.1.10|53|q|17843|0|56|17843+ A? portal.ridgelinemed.example.
11:00:33.225636|udp|10.20.1.10|53|10.20.6.40|60905|r|17843|0|72|17843 1/0/0 A 10.20.6.40
11:01:07.000000|tcp|10.20.9.40|42110|10.20.6.40|9100|S|3752879108|29200|0|
11:01:07.000617|tcp|10.20.6.40|9100|10.20.9.40|42110|S.|1198772967|62720|0|
11:01:07.001720|tcp|10.20.9.40|42110|10.20.6.40|9100|.|3752879109|29200|0|
11:01:07.022326|tcp|10.20.9.40|42110|10.20.6.40|9100|P.|3752879109|29200|527|GET /metrics HTTP/1.1
11:01:07.027869|tcp|10.20.6.40|9100|10.20.9.40|42110|P.|1198772968|62720|880|
11:01:07.028169|tcp|10.20.9.40|42110|10.20.6.40|9100|.|3752879636|29200|0|
11:01:07.048169|tcp|10.20.9.40|42110|10.20.6.40|9100|F.|3752879636|29200|0|
11:01:07.048669|tcp|10.20.6.40|9100|10.20.9.40|42110|F.|1198773848|62720|0|
11:01:07.048869|tcp|10.20.9.40|42110|10.20.6.40|9100|.|3752879637|29200|0|
11:01:10.989146|udp|10.20.6.40|60217|10.20.1.10|53|q|19751|0|40|19751+ A? example.com.
11:01:10.993044|udp|10.20.1.10|53|10.20.6.40|60217|r|19751|0|56|19751 1/0/0 A 192.0.2.10
11:01:14.586385|tcp|203.0.113.55|40270|10.20.6.40|22|S|1083236560|29200|0|
11:01:14.587280|tcp|10.20.6.40|22|203.0.113.55|40270|S.|2602198712|65535|0|
11:01:14.588262|tcp|203.0.113.55|40270|10.20.6.40|22|.|1083236561|29200|0|
11:01:14.615931|tcp|203.0.113.55|40270|10.20.6.40|22|P.|1083236561|29200|182|SSH-2.0-libssh2_1.10.0
11:01:14.617025|tcp|10.20.6.40|22|203.0.113.55|40270|P.|2602198713|65535|502|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
11:01:14.617325|tcp|203.0.113.55|40270|10.20.6.40|22|.|1083236743|29200|0|
11:01:14.650263|tcp|203.0.113.55|40270|10.20.6.40|22|P.|1083236743|29200|208|
11:01:14.655528|tcp|10.20.6.40|22|203.0.113.55|40270|P.|2602199215|65535|265|
11:01:14.655828|tcp|203.0.113.55|40270|10.20.6.40|22|.|1083236951|29200|0|
11:01:14.675828|tcp|203.0.113.55|40270|10.20.6.40|22|F.|1083236951|29200|0|
11:01:14.676328|tcp|10.20.6.40|22|203.0.113.55|40270|F.|2602199480|65535|0|
11:01:14.676528|tcp|203.0.113.55|40270|10.20.6.40|22|.|1083236952|29200|0|
11:01:56.377237|udp|10.20.6.40|39418|10.20.1.10|53|q|6452|0|44|6452+ A? www.example.com.
11:01:56.379527|udp|10.20.1.10|53|10.20.6.40|39418|r|6452|0|60|6452 1/0/0 A 192.0.2.10
11:02:07.000000|tcp|10.20.9.40|58529|10.20.6.40|9100|S|797295150|62720|0|
11:02:07.000795|tcp|10.20.6.40|9100|10.20.9.40|58529|S.|2246729495|64240|0|
11:02:07.001421|tcp|10.20.9.40|58529|10.20.6.40|9100|.|797295151|62720|0|
11:02:07.048597|tcp|10.20.9.40|58529|10.20.6.40|9100|P.|797295151|62720|851|GET /metrics HTTP/1.1
11:02:07.053983|tcp|10.20.6.40|9100|10.20.9.40|58529|P.|2246729496|64240|604|
11:02:07.054283|tcp|10.20.9.40|58529|10.20.6.40|9100|.|797296002|62720|0|
11:02:07.074283|tcp|10.20.9.40|58529|10.20.6.40|9100|F.|797296002|62720|0|
11:02:07.074783|tcp|10.20.6.40|9100|10.20.9.40|58529|F.|2246730100|64240|0|
11:02:07.074983|tcp|10.20.9.40|58529|10.20.6.40|9100|.|797296003|62720|0|
11:02:08.089387|tcp|203.0.113.140|59873|10.20.6.40|135|S|2755881920|62720|0|
11:02:08.089763|tcp|10.20.6.40|135|203.0.113.140|59873|R.|0|0|0|
11:02:13.730337|tcp|203.0.113.140|49918|10.20.6.40|25|S|1340795159|65535|0|
11:02:13.730661|tcp|10.20.6.40|25|203.0.113.140|49918|R.|0|0|0|
11:02:19.136801|tcp|203.0.113.140|46682|10.20.6.40|21|S|2410527749|65535|0|
11:02:19.137307|tcp|10.20.6.40|21|203.0.113.140|46682|R.|0|0|0|
11:02:20.170369|tcp|203.0.113.140|42575|10.20.6.40|5432|S|1924727297|64240|0|
11:02:20.170752|tcp|10.20.6.40|5432|203.0.113.140|42575|R.|0|0|0|
11:02:26.471559|tcp|203.0.113.140|53888|10.20.6.40|23|S|402636892|64240|0|
11:02:26.471904|tcp|10.20.6.40|23|203.0.113.140|53888|R.|0|0|0|
11:02:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 32
11:02:31.000333|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 32
11:03:03.867591|udp|10.20.6.40|38326|10.20.1.10|53|q|56792|0|64|56792+ A? rmg-monitor-01.ridgelinemed.example.
11:03:03.869798|udp|10.20.1.10|53|10.20.6.40|38326|r|56792|0|80|56792 1/0/0 A 10.20.9.40
11:03:07.000000|tcp|10.20.9.40|51425|10.20.6.40|9100|S|670484405|64240|0|
11:03:07.001381|tcp|10.20.6.40|9100|10.20.9.40|51425|S.|2331478938|64240|0|
11:03:07.001704|tcp|10.20.9.40|51425|10.20.6.40|9100|.|670484406|64240|0|
11:03:07.061078|tcp|10.20.9.40|51425|10.20.6.40|9100|P.|670484406|64240|548|GET /metrics HTTP/1.1
11:03:07.063634|tcp|10.20.6.40|9100|10.20.9.40|51425|P.|2331478939|64240|717|
11:03:07.063934|tcp|10.20.9.40|51425|10.20.6.40|9100|.|670484954|64240|0|
11:03:07.083934|tcp|10.20.9.40|51425|10.20.6.40|9100|F.|670484954|64240|0|
11:03:07.084434|tcp|10.20.6.40|9100|10.20.9.40|51425|F.|2331479656|64240|0|
11:03:07.084634|tcp|10.20.9.40|51425|10.20.6.40|9100|.|670484955|64240|0|
11:03:18.000000|tcp|203.0.113.55|55204|10.20.6.40|22|S|414749530|65535|0|
11:03:18.000705|tcp|10.20.6.40|22|203.0.113.55|55204|S.|2407726910|65535|0|
11:03:18.001045|tcp|203.0.113.55|55204|10.20.6.40|22|.|414749531|65535|0|
11:03:20.554534|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414749531|65535|165|SSH-2.0-libssh2_1.10.0
11:03:20.556158|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407726911|65535|288|SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.10
11:03:20.556458|tcp|203.0.113.55|55204|10.20.6.40|22|.|414749696|65535|0|
11:03:23.225695|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414749696|65535|146|
11:03:23.230962|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407727199|65535|159|
11:03:23.231262|tcp|203.0.113.55|55204|10.20.6.40|22|.|414749842|65535|0|
11:03:26.219910|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414749842|65535|111|
11:03:26.221547|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407727358|65535|287|
11:03:26.221847|tcp|203.0.113.55|55204|10.20.6.40|22|.|414749953|65535|0|
11:03:29.015660|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414749953|65535|169|
11:03:29.020450|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407727645|65535|350|
11:03:29.020750|tcp|203.0.113.55|55204|10.20.6.40|22|.|414750122|65535|0|
11:03:30.770057|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414750122|65535|109|
11:03:30.775175|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407727995|65535|102|
11:03:30.775475|tcp|203.0.113.55|55204|10.20.6.40|22|.|414750231|65535|0|
11:03:31.986434|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414750231|65535|156|
11:03:31.989592|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407728097|65535|96|
11:03:31.989892|tcp|203.0.113.55|55204|10.20.6.40|22|.|414750387|65535|0|
11:03:33.567947|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414750387|65535|138|
11:03:33.569454|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407728193|65535|345|
11:03:33.569754|tcp|203.0.113.55|55204|10.20.6.40|22|.|414750525|65535|0|
11:03:36.615871|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414750525|65535|153|
11:03:36.621705|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407728538|65535|136|
11:03:36.622005|tcp|203.0.113.55|55204|10.20.6.40|22|.|414750678|65535|0|
11:03:39.144514|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414750678|65535|123|
11:03:39.148159|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407728674|65535|148|
11:03:39.148459|tcp|203.0.113.55|55204|10.20.6.40|22|.|414750801|65535|0|
11:03:41.635424|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414750801|65535|123|
11:03:41.640964|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407728822|65535|92|
11:03:41.641264|tcp|203.0.113.55|55204|10.20.6.40|22|.|414750924|65535|0|
11:03:43.088553|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414750924|65535|145|
11:03:43.090209|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407728914|65535|268|
11:03:43.090509|tcp|203.0.113.55|55204|10.20.6.40|22|.|414751069|65535|0|
11:03:44.489776|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414751069|65535|141|
11:03:44.492268|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407729182|65535|206|
11:03:44.492568|tcp|203.0.113.55|55204|10.20.6.40|22|.|414751210|65535|0|
11:03:45.075445|udp|10.20.6.40|52940|10.20.1.10|53|q|8784|0|44|8784+ A? www.example.com.
11:03:45.078111|udp|10.20.1.10|53|10.20.6.40|52940|r|8784|0|60|8784 1/0/0 A 192.0.2.10
11:03:46.258194|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414751210|65535|105|
11:03:46.263650|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407729388|65535|295|
11:03:46.263950|tcp|203.0.113.55|55204|10.20.6.40|22|.|414751315|65535|0|
11:03:47.364573|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414751315|65535|171|
11:03:47.370538|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407729683|65535|332|
11:03:47.370838|tcp|203.0.113.55|55204|10.20.6.40|22|.|414751486|65535|0|
11:03:49.928612|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414751486|65535|132|
11:03:49.930404|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407730015|65535|159|
11:03:49.930704|tcp|203.0.113.55|55204|10.20.6.40|22|.|414751618|65535|0|
11:03:52.803499|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414751618|65535|130|
11:03:52.809141|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407730174|65535|282|
11:03:52.809441|tcp|203.0.113.55|55204|10.20.6.40|22|.|414751748|65535|0|
11:03:54.917862|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414751748|65535|172|
11:03:54.923385|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407730456|65535|285|
11:03:54.923685|tcp|203.0.113.55|55204|10.20.6.40|22|.|414751920|65535|0|
11:03:57.585159|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414751920|65535|173|
11:03:57.587032|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407730741|65535|221|
11:03:57.587332|tcp|203.0.113.55|55204|10.20.6.40|22|.|414752093|65535|0|
11:03:59.666309|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414752093|65535|124|
11:03:59.671170|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407730962|65535|358|
11:03:59.671470|tcp|203.0.113.55|55204|10.20.6.40|22|.|414752217|65535|0|
11:04:01.237792|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414752217|65535|163|
11:04:01.240152|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407731320|65535|235|
11:04:01.240452|tcp|203.0.113.55|55204|10.20.6.40|22|.|414752380|65535|0|
11:04:03.913741|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414752380|65535|160|
11:04:03.915087|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407731555|65535|150|
11:04:03.915387|tcp|203.0.113.55|55204|10.20.6.40|22|.|414752540|65535|0|
11:04:06.240775|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414752540|65535|127|
11:04:06.244291|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407731705|65535|130|
11:04:06.244591|tcp|203.0.113.55|55204|10.20.6.40|22|.|414752667|65535|0|
11:04:07.000000|tcp|10.20.9.40|53554|10.20.6.40|9100|S|1013337645|65535|0|
11:04:07.001282|tcp|10.20.6.40|9100|10.20.9.40|53554|S.|1332739079|64240|0|
11:04:07.002210|tcp|10.20.9.40|53554|10.20.6.40|9100|.|1013337646|65535|0|
11:04:07.020746|tcp|10.20.9.40|53554|10.20.6.40|9100|P.|1013337646|65535|542|GET /metrics HTTP/1.1
11:04:07.023100|tcp|10.20.6.40|9100|10.20.9.40|53554|P.|1332739080|64240|1653|
11:04:07.023400|tcp|10.20.9.40|53554|10.20.6.40|9100|.|1013338188|65535|0|
11:04:07.043400|tcp|10.20.9.40|53554|10.20.6.40|9100|F.|1013338188|65535|0|
11:04:07.043900|tcp|10.20.6.40|9100|10.20.9.40|53554|F.|1332740733|64240|0|
11:04:07.044100|tcp|10.20.9.40|53554|10.20.6.40|9100|.|1013338189|65535|0|
11:04:08.192071|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414752667|65535|127|
11:04:08.195696|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407731835|65535|222|
11:04:08.195996|tcp|203.0.113.55|55204|10.20.6.40|22|.|414752794|65535|0|
11:04:10.578294|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414752794|65535|118|
11:04:10.580833|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407732057|65535|260|
11:04:10.581133|tcp|203.0.113.55|55204|10.20.6.40|22|.|414752912|65535|0|
11:04:12.825849|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414752912|65535|121|
11:04:12.828232|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407732317|65535|184|
11:04:12.828532|tcp|203.0.113.55|55204|10.20.6.40|22|.|414753033|65535|0|
11:04:15.431512|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414753033|65535|148|
11:04:15.435842|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407732501|65535|101|
11:04:15.436142|tcp|203.0.113.55|55204|10.20.6.40|22|.|414753181|65535|0|
11:04:17.018709|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414753181|65535|151|
11:04:17.021589|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407732602|65535|294|
11:04:17.021889|tcp|203.0.113.55|55204|10.20.6.40|22|.|414753332|65535|0|
11:04:18.351721|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414753332|65535|101|
11:04:18.355170|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407732896|65535|114|
11:04:18.355470|tcp|203.0.113.55|55204|10.20.6.40|22|.|414753433|65535|0|
11:04:21.416859|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414753433|65535|124|
11:04:21.419561|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407733010|65535|222|
11:04:21.419861|tcp|203.0.113.55|55204|10.20.6.40|22|.|414753557|65535|0|
11:04:23.673555|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414753557|65535|162|
11:04:23.678046|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407733232|65535|131|
11:04:23.678346|tcp|203.0.113.55|55204|10.20.6.40|22|.|414753719|65535|0|
11:04:24.554226|udp|10.20.6.40|44596|10.20.1.10|53|q|61003|0|40|61003+ A? example.com.
11:04:24.557826|udp|10.20.1.10|53|10.20.6.40|44596|r|61003|0|56|61003 1/0/0 A 192.0.2.10
11:04:26.862433|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414753719|65535|126|
11:04:26.867907|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407733363|65535|112|
11:04:26.868207|tcp|203.0.113.55|55204|10.20.6.40|22|.|414753845|65535|0|
11:04:28.185155|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414753845|65535|107|
11:04:28.186293|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407733475|65535|248|
11:04:28.186593|tcp|203.0.113.55|55204|10.20.6.40|22|.|414753952|65535|0|
11:04:29.581283|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414753952|65535|144|
11:04:29.587062|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407733723|65535|330|
11:04:29.587362|tcp|203.0.113.55|55204|10.20.6.40|22|.|414754096|65535|0|
11:04:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 33
11:04:31.000503|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 33
11:04:31.156507|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414754096|65535|144|
11:04:31.159264|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407734053|65535|178|
11:04:31.159564|tcp|203.0.113.55|55204|10.20.6.40|22|.|414754240|65535|0|
11:04:33.323986|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414754240|65535|178|
11:04:33.327120|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407734231|65535|262|
11:04:33.327420|tcp|203.0.113.55|55204|10.20.6.40|22|.|414754418|65535|0|
11:04:35.892934|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414754418|65535|143|
11:04:35.895136|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407734493|65535|245|
11:04:35.895436|tcp|203.0.113.55|55204|10.20.6.40|22|.|414754561|65535|0|
11:04:37.374105|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414754561|65535|161|
11:04:37.376475|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407734738|65535|195|
11:04:37.376775|tcp|203.0.113.55|55204|10.20.6.40|22|.|414754722|65535|0|
11:04:40.545043|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414754722|65535|116|
11:04:40.548964|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407734933|65535|102|
11:04:40.549264|tcp|203.0.113.55|55204|10.20.6.40|22|.|414754838|65535|0|
11:04:42.703934|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414754838|65535|178|
11:04:42.707241|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407735035|65535|218|
11:04:42.707541|tcp|203.0.113.55|55204|10.20.6.40|22|.|414755016|65535|0|
11:04:44.418930|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414755016|65535|157|
11:04:44.423899|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407735253|65535|160|
11:04:44.424199|tcp|203.0.113.55|55204|10.20.6.40|22|.|414755173|65535|0|
11:04:45.963260|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414755173|65535|106|
11:04:45.967300|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407735413|65535|171|
11:04:45.967600|tcp|203.0.113.55|55204|10.20.6.40|22|.|414755279|65535|0|
11:04:48.586300|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414755279|65535|147|
11:04:48.591714|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407735584|65535|95|
11:04:48.592014|tcp|203.0.113.55|55204|10.20.6.40|22|.|414755426|65535|0|
11:04:50.692230|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414755426|65535|140|
11:04:50.695004|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407735679|65535|108|
11:04:50.695304|tcp|203.0.113.55|55204|10.20.6.40|22|.|414755566|65535|0|
11:04:52.700063|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414755566|65535|142|
11:04:52.705376|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407735787|65535|199|
11:04:52.705676|tcp|203.0.113.55|55204|10.20.6.40|22|.|414755708|65535|0|
11:04:54.415164|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414755708|65535|90|
11:04:54.419334|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407735986|65535|289|
11:04:54.419634|tcp|203.0.113.55|55204|10.20.6.40|22|.|414755798|65535|0|
11:04:56.786654|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414755798|65535|105|
11:04:56.791712|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407736275|65535|328|
11:04:56.792012|tcp|203.0.113.55|55204|10.20.6.40|22|.|414755903|65535|0|
11:04:59.462741|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414755903|65535|94|
11:04:59.463900|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407736603|65535|330|
11:04:59.464200|tcp|203.0.113.55|55204|10.20.6.40|22|.|414755997|65535|0|
11:05:01.109389|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414755997|65535|147|
11:05:01.113503|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407736933|65535|178|
11:05:01.113803|tcp|203.0.113.55|55204|10.20.6.40|22|.|414756144|65535|0|
11:05:03.420000|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414756144|65535|112|
11:05:03.421273|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407737111|65535|297|
11:05:03.421573|tcp|203.0.113.55|55204|10.20.6.40|22|.|414756256|65535|0|
11:05:06.258540|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414756256|65535|172|
11:05:06.260241|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407737408|65535|152|
11:05:06.260541|tcp|203.0.113.55|55204|10.20.6.40|22|.|414756428|65535|0|
11:05:07.000000|tcp|10.20.9.40|54970|10.20.6.40|9100|S|796341790|62720|0|
11:05:07.000462|tcp|10.20.6.40|9100|10.20.9.40|54970|S.|2214270516|65535|0|
11:05:07.001253|tcp|10.20.9.40|54970|10.20.6.40|9100|.|796341791|62720|0|
11:05:07.014746|tcp|10.20.9.40|54970|10.20.6.40|9100|P.|796341791|62720|643|GET /metrics HTTP/1.1
11:05:07.017376|tcp|10.20.6.40|9100|10.20.9.40|54970|P.|2214270517|65535|1224|
11:05:07.017676|tcp|10.20.9.40|54970|10.20.6.40|9100|.|796342434|62720|0|
11:05:07.037676|tcp|10.20.9.40|54970|10.20.6.40|9100|F.|796342434|62720|0|
11:05:07.038176|tcp|10.20.6.40|9100|10.20.9.40|54970|F.|2214271741|65535|0|
11:05:07.038376|tcp|10.20.9.40|54970|10.20.6.40|9100|.|796342435|62720|0|
11:05:09.270921|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414756428|65535|113|
11:05:09.276568|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407737560|65535|197|
11:05:09.276868|tcp|203.0.113.55|55204|10.20.6.40|22|.|414756541|65535|0|
11:05:12.049585|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414756541|65535|138|
11:05:12.055514|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407737757|65535|234|
11:05:12.055814|tcp|203.0.113.55|55204|10.20.6.40|22|.|414756679|65535|0|
11:05:14.276493|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414756679|65535|100|
11:05:14.278863|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407737991|65535|123|
11:05:14.279163|tcp|203.0.113.55|55204|10.20.6.40|22|.|414756779|65535|0|
11:05:17.178944|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414756779|65535|102|
11:05:17.180613|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407738114|65535|321|
11:05:17.180913|tcp|203.0.113.55|55204|10.20.6.40|22|.|414756881|65535|0|
11:05:19.625066|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414756881|65535|112|
11:05:19.629016|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407738435|65535|254|
11:05:19.629316|tcp|203.0.113.55|55204|10.20.6.40|22|.|414756993|65535|0|
11:05:22.659854|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414756993|65535|142|
11:05:22.663178|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407738689|65535|234|
11:05:22.663478|tcp|203.0.113.55|55204|10.20.6.40|22|.|414757135|65535|0|
11:05:24.327198|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414757135|65535|137|
11:05:24.329790|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407738923|65535|260|
11:05:24.330090|tcp|203.0.113.55|55204|10.20.6.40|22|.|414757272|65535|0|
11:05:26.288042|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414757272|65535|115|
11:05:26.294036|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407739183|65535|345|
11:05:26.294336|tcp|203.0.113.55|55204|10.20.6.40|22|.|414757387|65535|0|
11:05:28.648948|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414757387|65535|138|
11:05:28.651805|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407739528|65535|325|
11:05:28.652105|tcp|203.0.113.55|55204|10.20.6.40|22|.|414757525|65535|0|
11:05:29.925133|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414757525|65535|98|
11:05:29.926342|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407739853|65535|227|
11:05:29.926642|tcp|203.0.113.55|55204|10.20.6.40|22|.|414757623|65535|0|
11:05:31.402865|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414757623|65535|114|
11:05:31.405794|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407740080|65535|138|
11:05:31.406094|tcp|203.0.113.55|55204|10.20.6.40|22|.|414757737|65535|0|
11:05:32.628665|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414757737|65535|170|
11:05:32.633812|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407740218|65535|152|
11:05:32.634112|tcp|203.0.113.55|55204|10.20.6.40|22|.|414757907|65535|0|
11:05:33.524581|udp|10.20.6.40|55646|10.20.1.10|53|q|2259|0|63|2259+ A? rmg-backup-01.ridgelinemed.example.
11:05:33.527637|udp|10.20.1.10|53|10.20.6.40|55646|r|2259|0|79|2259 1/0/0 A 10.20.9.15
11:05:35.465440|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414757907|65535|97|
11:05:35.466674|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407740370|65535|354|
11:05:35.466974|tcp|203.0.113.55|55204|10.20.6.40|22|.|414758004|65535|0|
11:05:36.883389|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414758004|65535|129|
11:05:36.886956|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407740724|65535|310|
11:05:36.887256|tcp|203.0.113.55|55204|10.20.6.40|22|.|414758133|65535|0|
11:05:38.674594|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414758133|65535|137|
11:05:38.678164|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407741034|65535|340|
11:05:38.678464|tcp|203.0.113.55|55204|10.20.6.40|22|.|414758270|65535|0|
11:05:41.000000|tcp|10.20.6.40|53884|203.0.113.55|443|S|1467090297|65535|0|
11:05:41.000829|tcp|203.0.113.55|443|10.20.6.40|53884|S.|634975400|64240|0|
11:05:41.001736|tcp|10.20.6.40|53884|203.0.113.55|443|.|1467090298|65535|0|
11:05:41.050720|tcp|10.20.6.40|53884|203.0.113.55|443|P.|1467090298|65535|218|TLS SNI: cdn-sync.example
11:05:41.056305|tcp|203.0.113.55|443|10.20.6.40|53884|P.|634975401|64240|198|
11:05:41.056605|tcp|10.20.6.40|53884|203.0.113.55|443|.|1467090516|65535|0|
11:05:41.076605|tcp|10.20.6.40|53884|203.0.113.55|443|F.|1467090516|65535|0|
11:05:41.077105|tcp|203.0.113.55|443|10.20.6.40|53884|F.|634975599|64240|0|
11:05:41.077305|tcp|10.20.6.40|53884|203.0.113.55|443|.|1467090517|65535|0|
11:05:41.772100|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414758270|65535|93|
11:05:41.777367|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407741374|65535|151|
11:05:41.777667|tcp|203.0.113.55|55204|10.20.6.40|22|.|414758363|65535|0|
11:05:43.916889|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414758363|65535|153|
11:05:43.918001|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407741525|65535|131|
11:05:43.918301|tcp|203.0.113.55|55204|10.20.6.40|22|.|414758516|65535|0|
11:05:46.146754|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414758516|65535|119|
11:05:46.149416|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407741656|65535|155|
11:05:46.149716|tcp|203.0.113.55|55204|10.20.6.40|22|.|414758635|65535|0|
11:05:47.740821|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414758635|65535|164|
11:05:47.743393|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407741811|65535|230|
11:05:47.743693|tcp|203.0.113.55|55204|10.20.6.40|22|.|414758799|65535|0|
11:05:50.318629|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414758799|65535|117|
11:05:50.323673|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407742041|65535|162|
11:05:50.323973|tcp|203.0.113.55|55204|10.20.6.40|22|.|414758916|65535|0|
11:05:52.203674|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414758916|65535|111|
11:05:52.204780|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407742203|65535|337|
11:05:52.205080|tcp|203.0.113.55|55204|10.20.6.40|22|.|414759027|65535|0|
11:05:54.395786|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414759027|65535|148|
11:05:54.401007|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407742540|65535|189|
11:05:54.401307|tcp|203.0.113.55|55204|10.20.6.40|22|.|414759175|65535|0|
11:05:56.042825|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414759175|65535|147|
11:05:56.046105|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407742729|65535|181|
11:05:56.046405|tcp|203.0.113.55|55204|10.20.6.40|22|.|414759322|65535|0|
11:05:57.978552|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414759322|65535|175|
11:05:57.980892|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407742910|65535|156|
11:05:57.981192|tcp|203.0.113.55|55204|10.20.6.40|22|.|414759497|65535|0|
11:05:58.741192|tcp|198.51.100.23|55126|10.20.6.40|25|S|2758283455|62720|0|
11:05:58.741475|tcp|10.20.6.40|25|198.51.100.23|55126|R.|0|0|0|
11:05:59.085865|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414759497|65535|121|
11:05:59.090815|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407743066|65535|199|
11:05:59.091115|tcp|203.0.113.55|55204|10.20.6.40|22|.|414759618|65535|0|
11:06:00.792763|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414759618|65535|98|
11:06:00.793841|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407743265|65535|126|
11:06:00.794141|tcp|203.0.113.55|55204|10.20.6.40|22|.|414759716|65535|0|
11:06:03.227348|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414759716|65535|107|
11:06:03.228531|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407743391|65535|167|
11:06:03.228831|tcp|203.0.113.55|55204|10.20.6.40|22|.|414759823|65535|0|
11:06:05.109880|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414759823|65535|111|
11:06:05.113151|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407743558|65535|152|
11:06:05.113451|tcp|203.0.113.55|55204|10.20.6.40|22|.|414759934|65535|0|
11:06:07.000000|tcp|10.20.9.40|48090|10.20.6.40|9100|S|3180435232|29200|0|
11:06:07.001205|tcp|10.20.6.40|9100|10.20.9.40|48090|S.|2057549240|62720|0|
11:06:07.001765|tcp|10.20.9.40|48090|10.20.6.40|9100|.|3180435233|29200|0|
11:06:07.032725|tcp|10.20.9.40|48090|10.20.6.40|9100|P.|3180435233|29200|569|GET /metrics HTTP/1.1
11:06:07.037353|tcp|10.20.6.40|9100|10.20.9.40|48090|P.|2057549241|62720|1296|
11:06:07.037653|tcp|10.20.9.40|48090|10.20.6.40|9100|.|3180435802|29200|0|
11:06:07.057653|tcp|10.20.9.40|48090|10.20.6.40|9100|F.|3180435802|29200|0|
11:06:07.058153|tcp|10.20.6.40|9100|10.20.9.40|48090|F.|2057550537|62720|0|
11:06:07.058353|tcp|10.20.9.40|48090|10.20.6.40|9100|.|3180435803|29200|0|
11:06:07.416995|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414759934|65535|130|
11:06:07.421724|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407743710|65535|238|
11:06:07.422024|tcp|203.0.113.55|55204|10.20.6.40|22|.|414760064|65535|0|
11:06:09.260734|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414760064|65535|147|
11:06:09.263455|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407743948|65535|339|
11:06:09.263755|tcp|203.0.113.55|55204|10.20.6.40|22|.|414760211|65535|0|
11:06:10.619127|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414760211|65535|149|
11:06:10.621201|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407744287|65535|159|
11:06:10.621501|tcp|203.0.113.55|55204|10.20.6.40|22|.|414760360|65535|0|
11:06:10.677078|tcp|198.51.100.23|42131|10.20.6.40|23|S|2334281490|62720|0|
11:06:10.677588|tcp|10.20.6.40|23|198.51.100.23|42131|R.|0|0|0|
11:06:11.710911|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414760360|65535|168|
11:06:11.715433|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407744446|65535|155|
11:06:11.715733|tcp|203.0.113.55|55204|10.20.6.40|22|.|414760528|65535|0|
11:06:14.635579|tcp|198.51.100.23|44284|10.20.6.40|445|S|2414361394|64240|0|
11:06:14.635802|tcp|10.20.6.40|445|198.51.100.23|44284|R.|0|0|0|
11:06:14.820443|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414760528|65535|167|
11:06:14.825483|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407744601|65535|266|
11:06:14.825783|tcp|203.0.113.55|55204|10.20.6.40|22|.|414760695|65535|0|
11:06:16.682128|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414760695|65535|174|
11:06:16.684154|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407744867|65535|221|
11:06:16.684454|tcp|203.0.113.55|55204|10.20.6.40|22|.|414760869|65535|0|
11:06:17.910031|tcp|198.51.100.23|57655|10.20.6.40|5900|S|2657442148|65535|0|
11:06:17.910462|tcp|10.20.6.40|5900|198.51.100.23|57655|R.|0|0|0|
11:06:18.248571|udp|10.20.6.40|42428|10.20.1.10|53|q|48163|0|56|48163+ A? portal.ridgelinemed.example.
11:06:18.250892|udp|10.20.1.10|53|10.20.6.40|42428|r|48163|0|72|48163 1/0/0 A 10.20.6.40
11:06:19.009329|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414760869|65535|96|
11:06:19.011232|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407745088|65535|269|
11:06:19.011532|tcp|203.0.113.55|55204|10.20.6.40|22|.|414760965|65535|0|
11:06:19.618691|tcp|198.51.100.23|38632|10.20.6.40|8443|S|1631693291|62720|0|
11:06:19.618911|tcp|10.20.6.40|8443|198.51.100.23|38632|R.|0|0|0|
11:06:21.671552|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414760965|65535|167|
11:06:21.674424|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407745357|65535|208|
11:06:21.674724|tcp|203.0.113.55|55204|10.20.6.40|22|.|414761132|65535|0|
11:06:23.157584|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414761132|65535|162|
11:06:23.161090|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407745565|65535|315|
11:06:23.161390|tcp|203.0.113.55|55204|10.20.6.40|22|.|414761294|65535|0|
11:06:23.667567|tcp|198.51.100.23|49185|10.20.6.40|5432|S|1538109935|29200|0|
11:06:23.667817|tcp|10.20.6.40|5432|198.51.100.23|49185|R.|0|0|0|
11:06:24.730483|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414761294|65535|96|
11:06:24.732535|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407745880|65535|227|
11:06:24.732835|tcp|203.0.113.55|55204|10.20.6.40|22|.|414761390|65535|0|
11:06:27.408952|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414761390|65535|151|
11:06:27.413034|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407746107|65535|228|
11:06:27.413334|tcp|203.0.113.55|55204|10.20.6.40|22|.|414761541|65535|0|
11:06:29.742487|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414761541|65535|91|
11:06:29.745305|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407746335|65535|288|
11:06:29.745605|tcp|203.0.113.55|55204|10.20.6.40|22|.|414761632|65535|0|
11:06:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 34
11:06:31.000336|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 34
11:06:32.266663|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414761632|65535|174|
11:06:32.270664|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407746623|65535|272|
11:06:32.270964|tcp|203.0.113.55|55204|10.20.6.40|22|.|414761806|65535|0|
11:06:35.353543|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414761806|65535|98|
11:06:35.357680|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407746895|65535|347|
11:06:35.357980|tcp|203.0.113.55|55204|10.20.6.40|22|.|414761904|65535|0|
11:06:38.456298|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414761904|65535|100|
11:06:38.459214|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407747242|65535|159|
11:06:38.459514|tcp|203.0.113.55|55204|10.20.6.40|22|.|414762004|65535|0|
11:06:41.095201|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414762004|65535|151|
11:06:41.098443|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407747401|65535|279|
11:06:41.098743|tcp|203.0.113.55|55204|10.20.6.40|22|.|414762155|65535|0|
11:06:42.592681|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414762155|65535|94|
11:06:42.595105|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407747680|65535|166|
11:06:42.595405|tcp|203.0.113.55|55204|10.20.6.40|22|.|414762249|65535|0|
11:06:45.357184|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414762249|65535|165|
11:06:45.360013|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407747846|65535|280|
11:06:45.360313|tcp|203.0.113.55|55204|10.20.6.40|22|.|414762414|65535|0|
11:06:46.808632|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414762414|65535|155|
11:06:46.812791|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407748126|65535|160|
11:06:46.813091|tcp|203.0.113.55|55204|10.20.6.40|22|.|414762569|65535|0|
11:06:47.911186|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414762569|65535|142|
11:06:47.913994|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407748286|65535|193|
11:06:47.914294|tcp|203.0.113.55|55204|10.20.6.40|22|.|414762711|65535|0|
11:06:50.507553|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414762711|65535|176|
11:06:50.509693|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407748479|65535|302|
11:06:50.509993|tcp|203.0.113.55|55204|10.20.6.40|22|.|414762887|65535|0|
11:06:53.075692|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414762887|65535|147|
11:06:53.079271|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407748781|65535|191|
11:06:53.079571|tcp|203.0.113.55|55204|10.20.6.40|22|.|414763034|65535|0|
11:06:54.237160|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414763034|65535|112|
11:06:54.241767|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407748972|65535|227|
11:06:54.242067|tcp|203.0.113.55|55204|10.20.6.40|22|.|414763146|65535|0|
11:06:55.893026|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414763146|65535|148|
11:06:55.898906|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407749199|65535|341|
11:06:55.899206|tcp|203.0.113.55|55204|10.20.6.40|22|.|414763294|65535|0|
11:06:58.242572|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414763294|65535|120|
11:06:58.244404|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407749540|65535|297|
11:06:58.244704|tcp|203.0.113.55|55204|10.20.6.40|22|.|414763414|65535|0|
11:07:01.395975|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414763414|65535|167|
11:07:01.400633|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407749837|65535|154|
11:07:01.400933|tcp|203.0.113.55|55204|10.20.6.40|22|.|414763581|65535|0|
11:07:04.385434|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414763581|65535|110|
11:07:04.386886|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407749991|65535|152|
11:07:04.387186|tcp|203.0.113.55|55204|10.20.6.40|22|.|414763691|65535|0|
11:07:07.000000|tcp|10.20.9.40|42212|10.20.6.40|9100|S|758121942|65535|0|
11:07:07.001026|tcp|10.20.6.40|9100|10.20.9.40|42212|S.|289237697|62720|0|
11:07:07.002169|tcp|10.20.9.40|42212|10.20.6.40|9100|.|758121943|65535|0|
11:07:07.031920|tcp|10.20.9.40|42212|10.20.6.40|9100|P.|758121943|65535|898|GET /metrics HTTP/1.1
11:07:07.034846|tcp|10.20.6.40|9100|10.20.9.40|42212|P.|289237698|62720|1456|
11:07:07.035146|tcp|10.20.9.40|42212|10.20.6.40|9100|.|758122841|65535|0|
11:07:07.055146|tcp|10.20.9.40|42212|10.20.6.40|9100|F.|758122841|65535|0|
11:07:07.055646|tcp|10.20.6.40|9100|10.20.9.40|42212|F.|289239154|62720|0|
11:07:07.055846|tcp|10.20.9.40|42212|10.20.6.40|9100|.|758122842|65535|0|
11:07:07.168111|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414763691|65535|99|
11:07:07.171328|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407750143|65535|293|
11:07:07.171628|tcp|203.0.113.55|55204|10.20.6.40|22|.|414763790|65535|0|
11:07:10.247564|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414763790|65535|106|
11:07:10.251120|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407750436|65535|172|
11:07:10.251420|tcp|203.0.113.55|55204|10.20.6.40|22|.|414763896|65535|0|
11:07:13.369430|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414763896|65535|172|
11:07:13.374250|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407750608|65535|234|
11:07:13.374550|tcp|203.0.113.55|55204|10.20.6.40|22|.|414764068|65535|0|
11:07:14.757606|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414764068|65535|124|
11:07:14.763273|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407750842|65535|261|
11:07:14.763573|tcp|203.0.113.55|55204|10.20.6.40|22|.|414764192|65535|0|
11:07:16.596572|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414764192|65535|120|
11:07:16.597826|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407751103|65535|334|
11:07:16.598126|tcp|203.0.113.55|55204|10.20.6.40|22|.|414764312|65535|0|
11:07:19.346301|udp|10.20.6.40|60199|10.20.1.10|53|q|31046|0|64|31046+ A? rmg-monitor-01.ridgelinemed.example.
11:07:19.349350|udp|10.20.1.10|53|10.20.6.40|60199|r|31046|0|80|31046 1/0/0 A 10.20.9.40
11:07:19.440905|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414764312|65535|98|
11:07:19.444363|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407751437|65535|115|
11:07:19.444663|tcp|203.0.113.55|55204|10.20.6.40|22|.|414764410|65535|0|
11:07:21.484279|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414764410|65535|128|
11:07:21.487695|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407751552|65535|295|
11:07:21.487995|tcp|203.0.113.55|55204|10.20.6.40|22|.|414764538|65535|0|
11:07:24.071311|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414764538|65535|133|
11:07:24.075848|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407751847|65535|120|
11:07:24.076148|tcp|203.0.113.55|55204|10.20.6.40|22|.|414764671|65535|0|
11:07:26.927381|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414764671|65535|136|
11:07:26.930961|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407751967|65535|194|
11:07:26.931261|tcp|203.0.113.55|55204|10.20.6.40|22|.|414764807|65535|0|
11:07:29.901829|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414764807|65535|152|
11:07:29.905096|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407752161|65535|260|
11:07:29.905396|tcp|203.0.113.55|55204|10.20.6.40|22|.|414764959|65535|0|
11:07:32.305249|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414764959|65535|107|
11:07:32.308552|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407752421|65535|313|
11:07:32.308852|tcp|203.0.113.55|55204|10.20.6.40|22|.|414765066|65535|0|
11:07:33.919372|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414765066|65535|103|
11:07:33.920899|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407752734|65535|221|
11:07:33.921199|tcp|203.0.113.55|55204|10.20.6.40|22|.|414765169|65535|0|
11:07:36.138955|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414765169|65535|153|
11:07:36.141952|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407752955|65535|164|
11:07:36.142252|tcp|203.0.113.55|55204|10.20.6.40|22|.|414765322|65535|0|
11:07:38.634275|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414765322|65535|156|
11:07:38.638960|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407753119|65535|292|
11:07:38.639260|tcp|203.0.113.55|55204|10.20.6.40|22|.|414765478|65535|0|
11:07:41.622894|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414765478|65535|144|
11:07:41.624167|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407753411|65535|168|
11:07:41.624467|tcp|203.0.113.55|55204|10.20.6.40|22|.|414765622|65535|0|
11:07:43.164266|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414765622|65535|144|
11:07:43.167211|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407753579|65535|244|
11:07:43.167511|tcp|203.0.113.55|55204|10.20.6.40|22|.|414765766|65535|0|
11:07:45.044122|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414765766|65535|137|
11:07:45.048576|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407753823|65535|189|
11:07:45.048876|tcp|203.0.113.55|55204|10.20.6.40|22|.|414765903|65535|0|
11:07:47.890181|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414765903|65535|125|
11:07:47.892496|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407754012|65535|185|
11:07:47.892796|tcp|203.0.113.55|55204|10.20.6.40|22|.|414766028|65535|0|
11:07:50.241730|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414766028|65535|161|
11:07:50.244875|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407754197|65535|131|
11:07:50.245175|tcp|203.0.113.55|55204|10.20.6.40|22|.|414766189|65535|0|
11:07:52.327679|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414766189|65535|134|
11:07:52.330871|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407754328|65535|90|
11:07:52.331171|tcp|203.0.113.55|55204|10.20.6.40|22|.|414766323|65535|0|
11:07:54.953972|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414766323|65535|135|
11:07:54.956127|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407754418|65535|114|
11:07:54.956427|tcp|203.0.113.55|55204|10.20.6.40|22|.|414766458|65535|0|
11:07:56.776815|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414766458|65535|97|
11:07:56.778292|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407754532|65535|271|
11:07:56.778592|tcp|203.0.113.55|55204|10.20.6.40|22|.|414766555|65535|0|
11:07:58.630792|udp|10.20.6.40|50561|10.20.1.10|53|q|52028|0|63|52028+ A? rmg-backup-01.ridgelinemed.example.
11:07:58.633586|udp|10.20.1.10|53|10.20.6.40|50561|r|52028|0|79|52028 1/0/0 A 10.20.9.15
11:07:59.509260|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414766555|65535|161|
11:07:59.513570|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407754803|65535|337|
11:07:59.513870|tcp|203.0.113.55|55204|10.20.6.40|22|.|414766716|65535|0|
11:08:01.703562|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414766716|65535|132|
11:08:01.707150|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407755140|65535|204|
11:08:01.707450|tcp|203.0.113.55|55204|10.20.6.40|22|.|414766848|65535|0|
11:08:04.408757|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414766848|65535|114|
11:08:04.412601|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407755344|65535|268|
11:08:04.412901|tcp|203.0.113.55|55204|10.20.6.40|22|.|414766962|65535|0|
11:08:05.738301|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414766962|65535|153|
11:08:05.742692|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407755612|65535|93|
11:08:05.742992|tcp|203.0.113.55|55204|10.20.6.40|22|.|414767115|65535|0|
11:08:06.953300|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414767115|65535|106|
11:08:06.957347|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407755705|65535|163|
11:08:06.957647|tcp|203.0.113.55|55204|10.20.6.40|22|.|414767221|65535|0|
11:08:07.000000|tcp|10.20.9.40|36140|10.20.6.40|9100|S|1256805425|29200|0|
11:08:07.000674|tcp|10.20.6.40|9100|10.20.9.40|36140|S.|1118028131|62720|0|
11:08:07.001239|tcp|10.20.9.40|36140|10.20.6.40|9100|.|1256805426|29200|0|
11:08:07.036537|tcp|10.20.9.40|36140|10.20.6.40|9100|P.|1256805426|29200|791|GET /metrics HTTP/1.1
11:08:07.038762|tcp|10.20.6.40|9100|10.20.9.40|36140|P.|1118028132|62720|1392|
11:08:07.039062|tcp|10.20.9.40|36140|10.20.6.40|9100|.|1256806217|29200|0|
11:08:07.059062|tcp|10.20.9.40|36140|10.20.6.40|9100|F.|1256806217|29200|0|
11:08:07.059562|tcp|10.20.6.40|9100|10.20.9.40|36140|F.|1118029524|62720|0|
11:08:07.059762|tcp|10.20.9.40|36140|10.20.6.40|9100|.|1256806218|29200|0|
11:08:09.848596|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414767221|65535|94|
11:08:09.852503|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407755868|65535|204|
11:08:09.852803|tcp|203.0.113.55|55204|10.20.6.40|22|.|414767315|65535|0|
11:08:11.566937|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414767315|65535|140|
11:08:11.568179|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407756072|65535|178|
11:08:11.568479|tcp|203.0.113.55|55204|10.20.6.40|22|.|414767455|65535|0|
11:08:12.955105|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414767455|65535|177|
11:08:12.959899|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407756250|65535|331|
11:08:12.960199|tcp|203.0.113.55|55204|10.20.6.40|22|.|414767632|65535|0|
11:08:16.113590|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414767632|65535|121|
11:08:16.114867|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407756581|65535|103|
11:08:16.115167|tcp|203.0.113.55|55204|10.20.6.40|22|.|414767753|65535|0|
11:08:17.336756|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414767753|65535|142|
11:08:17.338914|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407756684|65535|292|
11:08:17.339214|tcp|203.0.113.55|55204|10.20.6.40|22|.|414767895|65535|0|
11:08:19.340020|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414767895|65535|154|
11:08:19.344481|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407756976|65535|315|
11:08:19.344781|tcp|203.0.113.55|55204|10.20.6.40|22|.|414768049|65535|0|
11:08:22.029659|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414768049|65535|162|
11:08:22.033019|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407757291|65535|341|
11:08:22.033319|tcp|203.0.113.55|55204|10.20.6.40|22|.|414768211|65535|0|
11:08:24.814632|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414768211|65535|165|
11:08:24.818155|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407757632|65535|294|
11:08:24.818455|tcp|203.0.113.55|55204|10.20.6.40|22|.|414768376|65535|0|
11:08:26.622187|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414768376|65535|143|
11:08:26.624362|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407757926|65535|160|
11:08:26.624662|tcp|203.0.113.55|55204|10.20.6.40|22|.|414768519|65535|0|
11:08:28.684205|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414768519|65535|168|
11:08:28.686644|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407758086|65535|358|
11:08:28.686944|tcp|203.0.113.55|55204|10.20.6.40|22|.|414768687|65535|0|
11:08:29.845339|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414768687|65535|98|
11:08:29.848507|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407758444|65535|260|
11:08:29.848807|tcp|203.0.113.55|55204|10.20.6.40|22|.|414768785|65535|0|
11:08:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 35
11:08:31.000327|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 35
11:08:32.631658|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414768785|65535|144|
11:08:32.633627|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407758704|65535|307|
11:08:32.633927|tcp|203.0.113.55|55204|10.20.6.40|22|.|414768929|65535|0|
11:08:35.418257|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414768929|65535|135|
11:08:35.421940|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407759011|65535|162|
11:08:35.422240|tcp|203.0.113.55|55204|10.20.6.40|22|.|414769064|65535|0|
11:08:37.858263|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414769064|65535|162|
11:08:37.861852|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407759173|65535|135|
11:08:37.862152|tcp|203.0.113.55|55204|10.20.6.40|22|.|414769226|65535|0|
11:08:39.055178|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414769226|65535|91|
11:08:39.056814|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407759308|65535|197|
11:08:39.057114|tcp|203.0.113.55|55204|10.20.6.40|22|.|414769317|65535|0|
11:08:41.497458|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414769317|65535|102|
11:08:41.500721|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407759505|65535|304|
11:08:41.501021|tcp|203.0.113.55|55204|10.20.6.40|22|.|414769419|65535|0|
11:08:42.863519|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414769419|65535|141|
11:08:42.868741|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407759809|65535|202|
11:08:42.869041|tcp|203.0.113.55|55204|10.20.6.40|22|.|414769560|65535|0|
11:08:44.240578|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414769560|65535|106|
11:08:44.246365|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407760011|65535|303|
11:08:44.246665|tcp|203.0.113.55|55204|10.20.6.40|22|.|414769666|65535|0|
11:08:46.225151|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414769666|65535|174|
11:08:46.226799|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407760314|65535|130|
11:08:46.227099|tcp|203.0.113.55|55204|10.20.6.40|22|.|414769840|65535|0|
11:08:47.843064|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414769840|65535|135|
11:08:47.846103|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407760444|65535|94|
11:08:47.846403|tcp|203.0.113.55|55204|10.20.6.40|22|.|414769975|65535|0|
11:08:49.575494|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414769975|65535|147|
11:08:49.577333|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407760538|65535|93|
11:08:49.577633|tcp|203.0.113.55|55204|10.20.6.40|22|.|414770122|65535|0|
11:08:52.080467|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414770122|65535|147|
11:08:52.081546|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407760631|65535|287|
11:08:52.081846|tcp|203.0.113.55|55204|10.20.6.40|22|.|414770269|65535|0|
11:08:52.323967|udp|10.20.6.40|50856|10.20.1.10|53|q|21117|0|63|21117+ A? rmg-backup-01.ridgelinemed.example.
11:08:52.326734|udp|10.20.1.10|53|10.20.6.40|50856|r|21117|0|79|21117 1/0/0 A 10.20.9.15
11:08:53.895152|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414770269|65535|154|
11:08:53.900965|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407760918|65535|228|
11:08:53.901265|tcp|203.0.113.55|55204|10.20.6.40|22|.|414770423|65535|0|
11:08:55.988175|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414770423|65535|135|
11:08:55.992879|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407761146|65535|326|
11:08:55.993179|tcp|203.0.113.55|55204|10.20.6.40|22|.|414770558|65535|0|
11:08:58.953668|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414770558|65535|95|
11:08:58.954971|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407761472|65535|289|
11:08:58.955271|tcp|203.0.113.55|55204|10.20.6.40|22|.|414770653|65535|0|
11:09:02.133839|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414770653|65535|167|
11:09:02.135690|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407761761|65535|291|
11:09:02.135990|tcp|203.0.113.55|55204|10.20.6.40|22|.|414770820|65535|0|
11:09:04.952783|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414770820|65535|127|
11:09:04.956632|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407762052|65535|310|
11:09:04.956932|tcp|203.0.113.55|55204|10.20.6.40|22|.|414770947|65535|0|
11:09:06.889247|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414770947|65535|177|
11:09:06.895238|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407762362|65535|188|
11:09:06.895538|tcp|203.0.113.55|55204|10.20.6.40|22|.|414771124|65535|0|
11:09:07.000000|tcp|10.20.9.40|55513|10.20.6.40|9100|S|2895544273|64240|0|
11:09:07.001234|tcp|10.20.6.40|9100|10.20.9.40|55513|S.|1444877779|64240|0|
11:09:07.002015|tcp|10.20.9.40|55513|10.20.6.40|9100|.|2895544274|64240|0|
11:09:07.044257|tcp|10.20.9.40|55513|10.20.6.40|9100|P.|2895544274|64240|675|GET /metrics HTTP/1.1
11:09:07.047428|tcp|10.20.6.40|9100|10.20.9.40|55513|P.|1444877780|64240|1676|
11:09:07.047728|tcp|10.20.9.40|55513|10.20.6.40|9100|.|2895544949|64240|0|
11:09:07.067728|tcp|10.20.9.40|55513|10.20.6.40|9100|F.|2895544949|64240|0|
11:09:07.068228|tcp|10.20.6.40|9100|10.20.9.40|55513|F.|1444879456|64240|0|
11:09:07.068428|tcp|10.20.9.40|55513|10.20.6.40|9100|.|2895544950|64240|0|
11:09:08.600766|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414771124|65535|124|
11:09:08.604882|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407762550|65535|332|
11:09:08.605182|tcp|203.0.113.55|55204|10.20.6.40|22|.|414771248|65535|0|
11:09:10.016795|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414771248|65535|109|
11:09:10.020394|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407762882|65535|220|
11:09:10.020694|tcp|203.0.113.55|55204|10.20.6.40|22|.|414771357|65535|0|
11:09:11.803042|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414771357|65535|115|
11:09:11.804550|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407763102|65535|230|
11:09:11.804850|tcp|203.0.113.55|55204|10.20.6.40|22|.|414771472|65535|0|
11:09:14.757864|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414771472|65535|92|
11:09:14.760486|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407763332|65535|166|
11:09:14.760786|tcp|203.0.113.55|55204|10.20.6.40|22|.|414771564|65535|0|
11:09:17.192845|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414771564|65535|165|
11:09:17.194464|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407763498|65535|152|
11:09:17.194764|tcp|203.0.113.55|55204|10.20.6.40|22|.|414771729|65535|0|
11:09:19.792842|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414771729|65535|166|
11:09:19.794195|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407763650|65535|302|
11:09:19.794495|tcp|203.0.113.55|55204|10.20.6.40|22|.|414771895|65535|0|
11:09:21.216188|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414771895|65535|131|
11:09:21.219355|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407763952|65535|298|
11:09:21.219655|tcp|203.0.113.55|55204|10.20.6.40|22|.|414772026|65535|0|
11:09:23.047687|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414772026|65535|157|
11:09:23.049526|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407764250|65535|360|
11:09:23.049826|tcp|203.0.113.55|55204|10.20.6.40|22|.|414772183|65535|0|
11:09:25.839254|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414772183|65535|101|
11:09:25.841519|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407764610|65535|141|
11:09:25.841819|tcp|203.0.113.55|55204|10.20.6.40|22|.|414772284|65535|0|
11:09:28.464039|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414772284|65535|145|
11:09:28.467248|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407764751|65535|199|
11:09:28.467548|tcp|203.0.113.55|55204|10.20.6.40|22|.|414772429|65535|0|
11:09:29.824299|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414772429|65535|110|
11:09:29.827475|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407764950|65535|312|
11:09:29.827775|tcp|203.0.113.55|55204|10.20.6.40|22|.|414772539|65535|0|
11:09:32.419523|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414772539|65535|167|
11:09:32.423624|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407765262|65535|188|
11:09:32.423924|tcp|203.0.113.55|55204|10.20.6.40|22|.|414772706|65535|0|
11:09:35.023171|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414772706|65535|129|
11:09:35.024840|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407765450|65535|124|
11:09:35.025140|tcp|203.0.113.55|55204|10.20.6.40|22|.|414772835|65535|0|
11:09:36.699560|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414772835|65535|109|
11:09:36.701446|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407765574|65535|256|
11:09:36.701746|tcp|203.0.113.55|55204|10.20.6.40|22|.|414772944|65535|0|
11:09:37.865745|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414772944|65535|178|
11:09:37.870254|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407765830|65535|342|
11:09:37.870554|tcp|203.0.113.55|55204|10.20.6.40|22|.|414773122|65535|0|
11:09:39.171006|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414773122|65535|154|
11:09:39.172948|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407766172|65535|310|
11:09:39.173248|tcp|203.0.113.55|55204|10.20.6.40|22|.|414773276|65535|0|
11:09:40.615812|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414773276|65535|148|
11:09:40.620268|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407766482|65535|159|
11:09:40.620568|tcp|203.0.113.55|55204|10.20.6.40|22|.|414773424|65535|0|
11:09:42.984342|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414773424|65535|127|
11:09:42.985451|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407766641|65535|146|
11:09:42.985751|tcp|203.0.113.55|55204|10.20.6.40|22|.|414773551|65535|0|
11:09:44.622846|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414773551|65535|126|
11:09:44.626235|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407766787|65535|227|
11:09:44.626535|tcp|203.0.113.55|55204|10.20.6.40|22|.|414773677|65535|0|
11:09:47.144591|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414773677|65535|97|
11:09:47.147205|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407767014|65535|314|
11:09:47.147505|tcp|203.0.113.55|55204|10.20.6.40|22|.|414773774|65535|0|
11:09:49.917159|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414773774|65535|112|
11:09:49.918673|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407767328|65535|193|
11:09:49.918973|tcp|203.0.113.55|55204|10.20.6.40|22|.|414773886|65535|0|
11:09:51.551480|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414773886|65535|122|
11:09:51.555993|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407767521|65535|331|
11:09:51.556293|tcp|203.0.113.55|55204|10.20.6.40|22|.|414774008|65535|0|
11:09:52.766842|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414774008|65535|135|
11:09:52.772498|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407767852|65535|357|
11:09:52.772798|tcp|203.0.113.55|55204|10.20.6.40|22|.|414774143|65535|0|
11:09:54.314682|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414774143|65535|134|
11:09:54.319571|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407768209|65535|341|
11:09:54.319871|tcp|203.0.113.55|55204|10.20.6.40|22|.|414774277|65535|0|
11:09:57.438803|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414774277|65535|123|
11:09:57.440203|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407768550|65535|191|
11:09:57.440503|tcp|203.0.113.55|55204|10.20.6.40|22|.|414774400|65535|0|
11:10:00.223653|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414774400|65535|129|
11:10:00.228637|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407768741|65535|109|
11:10:00.228937|tcp|203.0.113.55|55204|10.20.6.40|22|.|414774529|65535|0|
11:10:00.349621|udp|10.20.6.40|51409|10.20.1.10|53|q|43711|0|44|43711+ A? www.example.com.
11:10:00.351811|udp|10.20.1.10|53|10.20.6.40|51409|r|43711|0|60|43711 1/0/0 A 192.0.2.10
11:10:02.835571|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414774529|65535|102|
11:10:02.838899|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407768850|65535|248|
11:10:02.839199|tcp|203.0.113.55|55204|10.20.6.40|22|.|414774631|65535|0|
11:10:04.170270|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414774631|65535|95|
11:10:04.171503|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407769098|65535|289|
11:10:04.171803|tcp|203.0.113.55|55204|10.20.6.40|22|.|414774726|65535|0|
11:10:07.000000|tcp|10.20.9.40|51638|10.20.6.40|9100|S|2826205148|29200|0|
11:10:07.000500|tcp|10.20.6.40|9100|10.20.9.40|51638|S.|1751174672|62720|0|
11:10:07.001328|tcp|10.20.9.40|51638|10.20.6.40|9100|.|2826205149|29200|0|
11:10:07.014609|tcp|10.20.9.40|51638|10.20.6.40|9100|P.|2826205149|29200|727|GET /metrics HTTP/1.1
11:10:07.016725|tcp|10.20.6.40|9100|10.20.9.40|51638|P.|1751174673|62720|1729|
11:10:07.017025|tcp|10.20.9.40|51638|10.20.6.40|9100|.|2826205876|29200|0|
11:10:07.037025|tcp|10.20.9.40|51638|10.20.6.40|9100|F.|2826205876|29200|0|
11:10:07.037525|tcp|10.20.6.40|9100|10.20.9.40|51638|F.|1751176402|62720|0|
11:10:07.037725|tcp|10.20.9.40|51638|10.20.6.40|9100|.|2826205877|29200|0|
11:10:07.275624|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414774726|65535|163|
11:10:07.281585|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407769387|65535|164|
11:10:07.281885|tcp|203.0.113.55|55204|10.20.6.40|22|.|414774889|65535|0|
11:10:08.563494|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414774889|65535|116|
11:10:08.564510|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407769551|65535|239|
11:10:08.564810|tcp|203.0.113.55|55204|10.20.6.40|22|.|414775005|65535|0|
11:10:11.224600|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414775005|65535|160|
11:10:11.229638|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407769790|65535|213|
11:10:11.229938|tcp|203.0.113.55|55204|10.20.6.40|22|.|414775165|65535|0|
11:10:14.186289|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414775165|65535|171|
11:10:14.188619|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407770003|65535|175|
11:10:14.188919|tcp|203.0.113.55|55204|10.20.6.40|22|.|414775336|65535|0|
11:10:16.897375|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414775336|65535|174|
11:10:16.899736|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407770178|65535|308|
11:10:16.900036|tcp|203.0.113.55|55204|10.20.6.40|22|.|414775510|65535|0|
11:10:19.826932|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414775510|65535|138|
11:10:19.830116|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407770486|65535|323|
11:10:19.830416|tcp|203.0.113.55|55204|10.20.6.40|22|.|414775648|65535|0|
11:10:22.038101|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414775648|65535|141|
11:10:22.042190|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407770809|65535|334|
11:10:22.042490|tcp|203.0.113.55|55204|10.20.6.40|22|.|414775789|65535|0|
11:10:24.127572|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414775789|65535|147|
11:10:24.129275|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407771143|65535|113|
11:10:24.129575|tcp|203.0.113.55|55204|10.20.6.40|22|.|414775936|65535|0|
11:10:26.096918|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414775936|65535|93|
11:10:26.101750|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407771256|65535|201|
11:10:26.102050|tcp|203.0.113.55|55204|10.20.6.40|22|.|414776029|65535|0|
11:10:27.916085|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414776029|65535|93|
11:10:27.919034|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407771457|65535|203|
11:10:27.919334|tcp|203.0.113.55|55204|10.20.6.40|22|.|414776122|65535|0|
11:10:30.858267|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414776122|65535|147|
11:10:30.863878|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407771660|65535|289|
11:10:30.864178|tcp|203.0.113.55|55204|10.20.6.40|22|.|414776269|65535|0|
11:10:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 36
11:10:31.000439|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 36
11:10:32.687642|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414776269|65535|95|
11:10:32.689478|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407771949|65535|219|
11:10:32.689778|tcp|203.0.113.55|55204|10.20.6.40|22|.|414776364|65535|0|
11:10:34.127278|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414776364|65535|97|
11:10:34.129509|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407772168|65535|344|
11:10:34.129809|tcp|203.0.113.55|55204|10.20.6.40|22|.|414776461|65535|0|
11:10:35.595233|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414776461|65535|143|
11:10:35.599413|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407772512|65535|174|
11:10:35.599713|tcp|203.0.113.55|55204|10.20.6.40|22|.|414776604|65535|0|
11:10:38.070693|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414776604|65535|120|
11:10:38.075521|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407772686|65535|92|
11:10:38.075821|tcp|203.0.113.55|55204|10.20.6.40|22|.|414776724|65535|0|
11:10:40.202271|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414776724|65535|106|
11:10:40.204015|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407772778|65535|169|
11:10:40.204315|tcp|203.0.113.55|55204|10.20.6.40|22|.|414776830|65535|0|
11:10:41.000000|tcp|10.20.6.40|45890|203.0.113.55|443|S|1122995461|65535|0|
11:10:41.000431|tcp|203.0.113.55|443|10.20.6.40|45890|S.|798931547|62720|0|
11:10:41.000730|tcp|10.20.6.40|45890|203.0.113.55|443|.|1122995462|65535|0|
11:10:41.054917|tcp|10.20.6.40|45890|203.0.113.55|443|P.|1122995462|65535|269|TLS SNI: cdn-sync.example
11:10:41.056436|tcp|203.0.113.55|443|10.20.6.40|45890|P.|798931548|62720|487|
11:10:41.056736|tcp|10.20.6.40|45890|203.0.113.55|443|.|1122995731|65535|0|
11:10:41.076736|tcp|10.20.6.40|45890|203.0.113.55|443|F.|1122995731|65535|0|
11:10:41.077236|tcp|203.0.113.55|443|10.20.6.40|45890|F.|798932035|62720|0|
11:10:41.077436|tcp|10.20.6.40|45890|203.0.113.55|443|.|1122995732|65535|0|
11:10:42.292776|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414776830|65535|96|
11:10:42.295915|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407772947|65535|309|
11:10:42.296215|tcp|203.0.113.55|55204|10.20.6.40|22|.|414776926|65535|0|
11:10:43.780698|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414776926|65535|164|
11:10:43.786197|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407773256|65535|327|
11:10:43.786497|tcp|203.0.113.55|55204|10.20.6.40|22|.|414777090|65535|0|
11:10:45.449267|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414777090|65535|157|
11:10:45.450429|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407773583|65535|323|
11:10:45.450729|tcp|203.0.113.55|55204|10.20.6.40|22|.|414777247|65535|0|
11:10:48.456551|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414777247|65535|108|
11:10:48.458174|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407773906|65535|202|
11:10:48.458474|tcp|203.0.113.55|55204|10.20.6.40|22|.|414777355|65535|0|
11:10:49.770890|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414777355|65535|145|
11:10:49.776477|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407774108|65535|276|
11:10:49.776777|tcp|203.0.113.55|55204|10.20.6.40|22|.|414777500|65535|0|
11:10:50.221571|tcp|192.0.2.44|40906|10.20.6.40|135|S|954800240|29200|0|
11:10:50.221778|tcp|10.20.6.40|135|192.0.2.44|40906|R.|0|0|0|
11:10:51.330610|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414777500|65535|140|
11:10:51.333613|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407774384|65535|244|
11:10:51.333913|tcp|203.0.113.55|55204|10.20.6.40|22|.|414777640|65535|0|
11:10:52.543809|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414777640|65535|106|
11:10:52.547287|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407774628|65535|192|
11:10:52.547587|tcp|203.0.113.55|55204|10.20.6.40|22|.|414777746|65535|0|
11:10:52.639585|tcp|192.0.2.44|49964|10.20.6.40|8443|S|1195371994|65535|0|
11:10:52.640085|tcp|10.20.6.40|8443|192.0.2.44|49964|R.|0|0|0|
11:10:52.708713|udp|10.20.6.40|40075|10.20.1.10|53|q|35862|0|44|35862+ A? www.example.com.
11:10:52.712689|udp|10.20.1.10|53|10.20.6.40|40075|r|35862|0|60|35862 1/0/0 A 192.0.2.10
11:10:54.545425|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414777746|65535|108|
11:10:54.551173|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407774820|65535|109|
11:10:54.551473|tcp|203.0.113.55|55204|10.20.6.40|22|.|414777854|65535|0|
11:10:55.858850|tcp|192.0.2.44|48843|10.20.6.40|3389|S|1663183726|29200|0|
11:10:55.859218|tcp|10.20.6.40|3389|192.0.2.44|48843|R.|0|0|0|
11:10:56.486649|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414777854|65535|150|
11:10:56.491056|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407774929|65535|254|
11:10:56.491356|tcp|203.0.113.55|55204|10.20.6.40|22|.|414778004|65535|0|
11:10:59.368205|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414778004|65535|140|
11:10:59.370847|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407775183|65535|334|
11:10:59.371147|tcp|203.0.113.55|55204|10.20.6.40|22|.|414778144|65535|0|
11:11:02.535250|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414778144|65535|143|
11:11:02.537060|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407775517|65535|301|
11:11:02.537360|tcp|203.0.113.55|55204|10.20.6.40|22|.|414778287|65535|0|
11:11:04.667336|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414778287|65535|117|
11:11:04.671615|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407775818|65535|227|
11:11:04.671915|tcp|203.0.113.55|55204|10.20.6.40|22|.|414778404|65535|0|
11:11:05.475788|tcp|192.0.2.44|53059|10.20.6.40|445|S|1315328690|29200|0|
11:11:05.476025|tcp|10.20.6.40|445|192.0.2.44|53059|R.|0|0|0|
11:11:06.512770|tcp|192.0.2.44|45859|10.20.6.40|21|S|395907527|62720|0|
11:11:06.513107|tcp|10.20.6.40|21|192.0.2.44|45859|R.|0|0|0|
11:11:06.587057|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414778404|65535|166|
11:11:06.590637|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407776045|65535|263|
11:11:06.590937|tcp|203.0.113.55|55204|10.20.6.40|22|.|414778570|65535|0|
11:11:07.000000|tcp|10.20.9.40|54005|10.20.6.40|9100|S|3193185602|64240|0|
11:11:07.000428|tcp|10.20.6.40|9100|10.20.9.40|54005|S.|1255883373|62720|0|
11:11:07.000872|tcp|10.20.9.40|54005|10.20.6.40|9100|.|3193185603|64240|0|
11:11:07.052342|tcp|10.20.9.40|54005|10.20.6.40|9100|P.|3193185603|64240|867|GET /metrics HTTP/1.1
11:11:07.054200|tcp|10.20.6.40|9100|10.20.9.40|54005|P.|1255883374|62720|1461|
11:11:07.054500|tcp|10.20.9.40|54005|10.20.6.40|9100|.|3193186470|64240|0|
11:11:07.074500|tcp|10.20.9.40|54005|10.20.6.40|9100|F.|3193186470|64240|0|
11:11:07.075000|tcp|10.20.6.40|9100|10.20.9.40|54005|F.|1255884835|62720|0|
11:11:07.075200|tcp|10.20.9.40|54005|10.20.6.40|9100|.|3193186471|64240|0|
11:11:08.642703|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414778570|65535|169|
11:11:08.646792|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407776308|65535|262|
11:11:08.647092|tcp|203.0.113.55|55204|10.20.6.40|22|.|414778739|65535|0|
11:11:11.221434|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414778739|65535|138|
11:11:11.223095|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407776570|65535|219|
11:11:11.223395|tcp|203.0.113.55|55204|10.20.6.40|22|.|414778877|65535|0|
11:11:11.280418|tcp|192.0.2.44|42360|10.20.6.40|5900|S|3678652834|62720|0|
11:11:11.280770|tcp|10.20.6.40|5900|192.0.2.44|42360|R.|0|0|0|
11:11:13.603522|tcp|203.0.113.55|55204|10.20.6.40|22|P.|414778877|65535|153|
11:11:13.604954|tcp|10.20.6.40|22|203.0.113.55|55204|P.|2407776789|65535|230|
11:11:13.605254|tcp|203.0.113.55|55204|10.20.6.40|22|.|414779030|65535|0|
11:11:13.625254|tcp|203.0.113.55|55204|10.20.6.40|22|F.|414779030|65535|0|
11:11:13.625754|tcp|10.20.6.40|22|203.0.113.55|55204|F.|2407777019|65535|0|
11:11:13.625954|tcp|203.0.113.55|55204|10.20.6.40|22|.|414779031|65535|0|
11:11:17.108318|tcp|192.0.2.44|41301|10.20.6.40|1433|S|301705440|65535|0|
11:11:17.108679|tcp|10.20.6.40|1433|192.0.2.44|41301|R.|0|0|0|
11:11:28.236195|udp|10.20.6.40|37845|10.20.1.10|53|q|37700|0|39|37700+ A? ubuntu.com.
11:11:28.239982|udp|10.20.1.10|53|10.20.6.40|37845|r|37700|0|55|37700 1/0/0 A 192.0.2.30
11:12:07.000000|tcp|10.20.9.40|47190|10.20.6.40|9100|S|2737754317|62720|0|
11:12:07.000627|tcp|10.20.6.40|9100|10.20.9.40|47190|S.|234571475|62720|0|
11:12:07.000888|tcp|10.20.9.40|47190|10.20.6.40|9100|.|2737754318|62720|0|
11:12:07.058383|tcp|10.20.9.40|47190|10.20.6.40|9100|P.|2737754318|62720|686|GET /metrics HTTP/1.1
11:12:07.059989|tcp|10.20.6.40|9100|10.20.9.40|47190|P.|234571476|62720|1504|
11:12:07.060289|tcp|10.20.9.40|47190|10.20.6.40|9100|.|2737755004|62720|0|
11:12:07.080289|tcp|10.20.9.40|47190|10.20.6.40|9100|F.|2737755004|62720|0|
11:12:07.080789|tcp|10.20.6.40|9100|10.20.9.40|47190|F.|234572980|62720|0|
11:12:07.080989|tcp|10.20.9.40|47190|10.20.6.40|9100|.|2737755005|62720|0|
11:12:24.465264|udp|10.20.6.40|47411|10.20.1.10|53|q|2084|0|44|2084+ A? www.example.com.
11:12:24.467685|udp|10.20.1.10|53|10.20.6.40|47411|r|2084|0|60|2084 1/0/0 A 192.0.2.10
11:12:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 37
11:12:31.000705|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 37
11:13:07.000000|tcp|10.20.9.40|36268|10.20.6.40|9100|S|2450528338|29200|0|
11:13:07.000956|tcp|10.20.6.40|9100|10.20.9.40|36268|S.|3468294355|29200|0|
11:13:07.001367|tcp|10.20.9.40|36268|10.20.6.40|9100|.|2450528339|29200|0|
11:13:07.024952|tcp|10.20.9.40|36268|10.20.6.40|9100|P.|2450528339|29200|516|GET /metrics HTTP/1.1
11:13:07.026190|tcp|10.20.6.40|9100|10.20.9.40|36268|P.|3468294356|29200|860|
11:13:07.026490|tcp|10.20.9.40|36268|10.20.6.40|9100|.|2450528855|29200|0|
11:13:07.046490|tcp|10.20.9.40|36268|10.20.6.40|9100|F.|2450528855|29200|0|
11:13:07.046990|tcp|10.20.6.40|9100|10.20.9.40|36268|F.|3468295216|29200|0|
11:13:07.047190|tcp|10.20.9.40|36268|10.20.6.40|9100|.|2450528856|29200|0|
11:13:11.767696|udp|10.20.6.40|56387|10.20.1.10|53|q|46156|0|64|46156+ A? rmg-monitor-01.ridgelinemed.example.
11:13:11.771094|udp|10.20.1.10|53|10.20.6.40|56387|r|46156|0|80|46156 1/0/0 A 10.20.9.40
11:14:07.000000|tcp|10.20.9.40|60210|10.20.6.40|9100|S|2132664081|62720|0|
11:14:07.001366|tcp|10.20.6.40|9100|10.20.9.40|60210|S.|3535751013|65535|0|
11:14:07.002001|tcp|10.20.9.40|60210|10.20.6.40|9100|.|2132664082|62720|0|
11:14:07.033289|tcp|10.20.9.40|60210|10.20.6.40|9100|P.|2132664082|62720|540|GET /metrics HTTP/1.1
11:14:07.034739|tcp|10.20.6.40|9100|10.20.9.40|60210|P.|3535751014|65535|1447|
11:14:07.035039|tcp|10.20.9.40|60210|10.20.6.40|9100|.|2132664622|62720|0|
11:14:07.055039|tcp|10.20.9.40|60210|10.20.6.40|9100|F.|2132664622|62720|0|
11:14:07.055539|tcp|10.20.6.40|9100|10.20.9.40|60210|F.|3535752461|65535|0|
11:14:07.055739|tcp|10.20.9.40|60210|10.20.6.40|9100|.|2132664623|62720|0|
11:14:16.797446|udp|10.20.6.40|48869|10.20.1.10|53|q|41594|0|44|41594+ A? www.example.com.
11:14:16.801437|udp|10.20.1.10|53|10.20.6.40|48869|r|41594|0|60|41594 1/0/0 A 192.0.2.10
11:14:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 38
11:14:31.000336|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 38
11:15:07.000000|tcp|10.20.9.40|54378|10.20.6.40|9100|S|1364229951|65535|0|
11:15:07.000672|tcp|10.20.6.40|9100|10.20.9.40|54378|S.|3027933924|65535|0|
11:15:07.001168|tcp|10.20.9.40|54378|10.20.6.40|9100|.|1364229952|65535|0|
11:15:07.020467|tcp|10.20.9.40|54378|10.20.6.40|9100|P.|1364229952|65535|485|GET /metrics HTTP/1.1
11:15:07.023418|tcp|10.20.6.40|9100|10.20.9.40|54378|P.|3027933925|65535|958|
11:15:07.023718|tcp|10.20.9.40|54378|10.20.6.40|9100|.|1364230437|65535|0|
11:15:07.043718|tcp|10.20.9.40|54378|10.20.6.40|9100|F.|1364230437|65535|0|
11:15:07.044218|tcp|10.20.6.40|9100|10.20.9.40|54378|F.|3027934883|65535|0|
11:15:07.044418|tcp|10.20.9.40|54378|10.20.6.40|9100|.|1364230438|65535|0|
11:15:24.608936|udp|10.20.6.40|55681|10.20.1.10|53|q|51878|0|64|51878+ A? rmg-monitor-01.ridgelinemed.example.
11:15:24.612016|udp|10.20.1.10|53|10.20.6.40|55681|r|51878|0|80|51878 1/0/0 A 10.20.9.40
11:15:41.000000|tcp|10.20.6.40|50335|203.0.113.55|443|S|3698834970|62720|0|
11:15:41.001089|tcp|203.0.113.55|443|10.20.6.40|50335|S.|918071550|29200|0|
11:15:41.002137|tcp|10.20.6.40|50335|203.0.113.55|443|.|3698834971|62720|0|
11:15:41.041243|tcp|10.20.6.40|50335|203.0.113.55|443|P.|3698834971|62720|302|TLS SNI: cdn-sync.example
11:15:41.044770|tcp|203.0.113.55|443|10.20.6.40|50335|P.|918071551|29200|653|
11:15:41.045070|tcp|10.20.6.40|50335|203.0.113.55|443|.|3698835273|62720|0|
11:15:41.065070|tcp|10.20.6.40|50335|203.0.113.55|443|F.|3698835273|62720|0|
11:15:41.065570|tcp|203.0.113.55|443|10.20.6.40|50335|F.|918072204|29200|0|
11:15:41.065770|tcp|10.20.6.40|50335|203.0.113.55|443|.|3698835274|62720|0|
11:16:07.000000|tcp|10.20.9.40|39877|10.20.6.40|9100|S|2160493126|62720|0|
11:16:07.001136|tcp|10.20.6.40|9100|10.20.9.40|39877|S.|3052792032|29200|0|
11:16:07.001930|tcp|10.20.9.40|39877|10.20.6.40|9100|.|2160493127|62720|0|
11:16:07.028307|tcp|10.20.9.40|39877|10.20.6.40|9100|P.|2160493127|62720|579|GET /metrics HTTP/1.1
11:16:07.031851|tcp|10.20.6.40|9100|10.20.9.40|39877|P.|3052792033|29200|1766|
11:16:07.032151|tcp|10.20.9.40|39877|10.20.6.40|9100|.|2160493706|62720|0|
11:16:07.052151|tcp|10.20.9.40|39877|10.20.6.40|9100|F.|2160493706|62720|0|
11:16:07.052651|tcp|10.20.6.40|9100|10.20.9.40|39877|F.|3052793799|29200|0|
11:16:07.052851|tcp|10.20.9.40|39877|10.20.6.40|9100|.|2160493707|62720|0|
11:16:07.532716|udp|10.20.6.40|58095|10.20.1.10|53|q|3158|0|63|3158+ A? rmg-backup-01.ridgelinemed.example.
11:16:07.534972|udp|10.20.1.10|53|10.20.6.40|58095|r|3158|0|79|3158 1/0/0 A 10.20.9.15
11:16:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 39
11:16:31.000534|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 39
11:16:42.250762|udp|10.20.6.40|58384|10.20.1.10|53|q|54459|0|39|54459+ A? ubuntu.com.
11:16:42.253359|udp|10.20.1.10|53|10.20.6.40|58384|r|54459|0|55|54459 1/0/0 A 192.0.2.30
11:17:07.000000|tcp|10.20.9.40|41170|10.20.6.40|9100|S|1149138378|65535|0|
11:17:07.001136|tcp|10.20.6.40|9100|10.20.9.40|41170|S.|1247997810|64240|0|
11:17:07.001915|tcp|10.20.9.40|41170|10.20.6.40|9100|.|1149138379|65535|0|
11:17:07.037155|tcp|10.20.9.40|41170|10.20.6.40|9100|P.|1149138379|65535|491|GET /metrics HTTP/1.1
11:17:07.039776|tcp|10.20.6.40|9100|10.20.9.40|41170|P.|1247997811|64240|1458|
11:17:07.040076|tcp|10.20.9.40|41170|10.20.6.40|9100|.|1149138870|65535|0|
11:17:07.060076|tcp|10.20.9.40|41170|10.20.6.40|9100|F.|1149138870|65535|0|
11:17:07.060576|tcp|10.20.6.40|9100|10.20.9.40|41170|F.|1247999269|64240|0|
11:17:07.060776|tcp|10.20.9.40|41170|10.20.6.40|9100|.|1149138871|65535|0|
11:17:16.035452|tcp|192.0.2.171|49535|10.20.6.40|25|S|1656012039|29200|0|
11:17:16.035704|tcp|10.20.6.40|25|192.0.2.171|49535|R.|0|0|0|
11:17:17.251659|tcp|192.0.2.171|32916|10.20.6.40|110|S|3834437144|29200|0|
11:17:17.252012|tcp|10.20.6.40|110|192.0.2.171|32916|R.|0|0|0|
11:17:21.922614|tcp|192.0.2.171|55379|10.20.6.40|21|S|2008989406|65535|0|
11:17:21.922991|tcp|10.20.6.40|21|192.0.2.171|55379|R.|0|0|0|
11:17:24.255501|tcp|192.0.2.171|57414|10.20.6.40|23|S|787780725|29200|0|
11:17:24.255715|tcp|10.20.6.40|23|192.0.2.171|57414|R.|0|0|0|
11:17:24.935105|tcp|192.0.2.171|49890|10.20.6.40|8080|S|28741228|64240|0|
11:17:24.935370|tcp|10.20.6.40|8080|192.0.2.171|49890|R.|0|0|0|
11:17:26.733841|tcp|192.0.2.171|43009|10.20.6.40|3306|S|124041376|65535|0|
11:17:26.734305|tcp|10.20.6.40|3306|192.0.2.171|43009|R.|0|0|0|
11:17:29.582795|tcp|192.0.2.171|57023|10.20.6.40|5900|S|1828802427|65535|0|
11:17:29.583142|tcp|10.20.6.40|5900|192.0.2.171|57023|R.|0|0|0|
11:17:35.167300|tcp|192.0.2.171|55216|10.20.6.40|1433|S|132597091|62720|0|
11:17:35.167564|tcp|10.20.6.40|1433|192.0.2.171|55216|R.|0|0|0|
11:17:35.367075|tcp|192.0.2.171|35310|10.20.6.40|8443|S|2853901877|65535|0|
11:17:35.367545|tcp|10.20.6.40|8443|192.0.2.171|35310|R.|0|0|0|
11:17:37.541511|udp|10.20.6.40|39028|10.20.1.10|53|q|56175|0|44|56175+ A? www.example.com.
11:17:37.544858|udp|10.20.1.10|53|10.20.6.40|39028|r|56175|0|60|56175 1/0/0 A 192.0.2.10
11:18:07.000000|tcp|10.20.9.40|49189|10.20.6.40|9100|S|3555575814|29200|0|
11:18:07.000702|tcp|10.20.6.40|9100|10.20.9.40|49189|S.|2383638271|29200|0|
11:18:07.000934|tcp|10.20.9.40|49189|10.20.6.40|9100|.|3555575815|29200|0|
11:18:07.022146|tcp|10.20.9.40|49189|10.20.6.40|9100|P.|3555575815|29200|705|GET /metrics HTTP/1.1
11:18:07.024055|tcp|10.20.6.40|9100|10.20.9.40|49189|P.|2383638272|29200|1208|
11:18:07.024355|tcp|10.20.9.40|49189|10.20.6.40|9100|.|3555576520|29200|0|
11:18:07.044355|tcp|10.20.9.40|49189|10.20.6.40|9100|F.|3555576520|29200|0|
11:18:07.044855|tcp|10.20.6.40|9100|10.20.9.40|49189|F.|2383639480|29200|0|
11:18:07.045055|tcp|10.20.9.40|49189|10.20.6.40|9100|.|3555576521|29200|0|
11:18:30.557900|udp|10.20.6.40|39455|10.20.1.10|53|q|23196|0|44|23196+ A? www.example.com.
11:18:30.560407|udp|10.20.1.10|53|10.20.6.40|39455|r|23196|0|60|23196 1/0/0 A 192.0.2.10
11:18:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 40
11:18:31.000784|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 40
11:19:07.000000|tcp|10.20.9.40|55407|10.20.6.40|9100|S|3667523862|65535|0|
11:19:07.000874|tcp|10.20.6.40|9100|10.20.9.40|55407|S.|355150847|62720|0|
11:19:07.001957|tcp|10.20.9.40|55407|10.20.6.40|9100|.|3667523863|65535|0|
11:19:07.023057|tcp|10.20.9.40|55407|10.20.6.40|9100|P.|3667523863|65535|542|GET /metrics HTTP/1.1
11:19:07.028998|tcp|10.20.6.40|9100|10.20.9.40|55407|P.|355150848|62720|1550|
11:19:07.029298|tcp|10.20.9.40|55407|10.20.6.40|9100|.|3667524405|65535|0|
11:19:07.049298|tcp|10.20.9.40|55407|10.20.6.40|9100|F.|3667524405|65535|0|
11:19:07.049798|tcp|10.20.6.40|9100|10.20.9.40|55407|F.|355152398|62720|0|
11:19:07.049998|tcp|10.20.9.40|55407|10.20.6.40|9100|.|3667524406|65535|0|
11:19:18.369619|udp|10.20.6.40|55862|10.20.1.10|53|q|47775|0|64|47775+ A? rmg-monitor-01.ridgelinemed.example.
11:19:18.372098|udp|10.20.1.10|53|10.20.6.40|55862|r|47775|0|80|47775 1/0/0 A 10.20.9.40
11:20:07.000000|tcp|10.20.9.40|50942|10.20.6.40|9100|S|388338410|64240|0|
11:20:07.000581|tcp|10.20.6.40|9100|10.20.9.40|50942|S.|1247470290|65535|0|
11:20:07.000953|tcp|10.20.9.40|50942|10.20.6.40|9100|.|388338411|64240|0|
11:20:07.050265|tcp|10.20.9.40|50942|10.20.6.40|9100|P.|388338411|64240|459|GET /metrics HTTP/1.1
11:20:07.055448|tcp|10.20.6.40|9100|10.20.9.40|50942|P.|1247470291|65535|1419|
11:20:07.055748|tcp|10.20.9.40|50942|10.20.6.40|9100|.|388338870|64240|0|
11:20:07.075748|tcp|10.20.9.40|50942|10.20.6.40|9100|F.|388338870|64240|0|
11:20:07.076248|tcp|10.20.6.40|9100|10.20.9.40|50942|F.|1247471710|65535|0|
11:20:07.076448|tcp|10.20.9.40|50942|10.20.6.40|9100|.|388338871|64240|0|
11:20:20.401707|udp|10.20.6.40|43506|10.20.1.10|53|q|56182|0|39|56182+ A? ubuntu.com.
11:20:20.405079|udp|10.20.1.10|53|10.20.6.40|43506|r|56182|0|55|56182 1/0/0 A 192.0.2.30
11:20:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 41
11:20:31.000765|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 41
11:20:41.000000|tcp|10.20.6.40|37358|203.0.113.55|443|S|460819503|29200|0|
11:20:41.000576|tcp|203.0.113.55|443|10.20.6.40|37358|S.|1371428234|29200|0|
11:20:41.001361|tcp|10.20.6.40|37358|203.0.113.55|443|.|460819504|29200|0|
11:20:41.045567|tcp|10.20.6.40|37358|203.0.113.55|443|P.|460819504|29200|256|TLS SNI: cdn-sync.example
11:20:41.051402|tcp|203.0.113.55|443|10.20.6.40|37358|P.|1371428235|29200|543|
11:20:41.051702|tcp|10.20.6.40|37358|203.0.113.55|443|.|460819760|29200|0|
11:20:41.071702|tcp|10.20.6.40|37358|203.0.113.55|443|F.|460819760|29200|0|
11:20:41.072202|tcp|203.0.113.55|443|10.20.6.40|37358|F.|1371428778|29200|0|
11:20:41.072402|tcp|10.20.6.40|37358|203.0.113.55|443|.|460819761|29200|0|
11:21:07.000000|tcp|10.20.9.40|57503|10.20.6.40|9100|S|664947515|62720|0|
11:21:07.001012|tcp|10.20.6.40|9100|10.20.9.40|57503|S.|1000960446|29200|0|
11:21:07.002030|tcp|10.20.9.40|57503|10.20.6.40|9100|.|664947516|62720|0|
11:21:07.032160|tcp|10.20.9.40|57503|10.20.6.40|9100|P.|664947516|62720|547|GET /metrics HTTP/1.1
11:21:07.034345|tcp|10.20.6.40|9100|10.20.9.40|57503|P.|1000960447|29200|563|
11:21:07.034645|tcp|10.20.9.40|57503|10.20.6.40|9100|.|664948063|62720|0|
11:21:07.054645|tcp|10.20.9.40|57503|10.20.6.40|9100|F.|664948063|62720|0|
11:21:07.055145|tcp|10.20.6.40|9100|10.20.9.40|57503|F.|1000961010|29200|0|
11:21:07.055345|tcp|10.20.9.40|57503|10.20.6.40|9100|.|664948064|62720|0|
11:21:26.044890|udp|10.20.6.40|55687|10.20.1.10|53|q|8538|0|56|8538+ A? portal.ridgelinemed.example.
11:21:26.048303|udp|10.20.1.10|53|10.20.6.40|55687|r|8538|0|72|8538 1/0/0 A 10.20.6.40
11:22:04.086000|tcp|198.51.100.202|33014|10.20.6.40|23|S|1622417289|65535|0|
11:22:04.086468|tcp|10.20.6.40|23|198.51.100.202|33014|R.|0|0|0|
11:22:07.000000|tcp|10.20.9.40|59813|10.20.6.40|9100|S|810530926|64240|0|
11:22:07.000842|tcp|10.20.6.40|9100|10.20.9.40|59813|S.|3215106447|64240|0|
11:22:07.001963|tcp|10.20.9.40|59813|10.20.6.40|9100|.|810530927|64240|0|
11:22:07.041449|tcp|10.20.9.40|59813|10.20.6.40|9100|P.|810530927|64240|501|GET /metrics HTTP/1.1
11:22:07.046947|tcp|10.20.6.40|9100|10.20.9.40|59813|P.|3215106448|64240|792|
11:22:07.047247|tcp|10.20.9.40|59813|10.20.6.40|9100|.|810531428|64240|0|
11:22:07.067247|tcp|10.20.9.40|59813|10.20.6.40|9100|F.|810531428|64240|0|
11:22:07.067747|tcp|10.20.6.40|9100|10.20.9.40|59813|F.|3215107240|64240|0|
11:22:07.067947|tcp|10.20.9.40|59813|10.20.6.40|9100|.|810531429|64240|0|
11:22:09.753735|tcp|198.51.100.202|59421|10.20.6.40|25|S|3180209665|65535|0|
11:22:09.754255|tcp|10.20.6.40|25|198.51.100.202|59421|R.|0|0|0|
11:22:10.041665|tcp|198.51.100.202|47349|10.20.6.40|3389|S|253665729|65535|0|
11:22:10.042001|tcp|10.20.6.40|3389|198.51.100.202|47349|R.|0|0|0|
11:22:11.583206|tcp|10.20.6.40|43523|192.0.2.10|443|S|1528285016|64240|0|
11:22:11.584022|tcp|192.0.2.10|443|10.20.6.40|43523|S.|2130966477|29200|0|
11:22:11.584947|tcp|10.20.6.40|43523|192.0.2.10|443|.|1528285017|64240|0|
11:22:11.616510|tcp|10.20.6.40|43523|192.0.2.10|443|P.|1528285017|64240|1064|TLS SNI: www.example.com
11:22:11.618299|tcp|192.0.2.10|443|10.20.6.40|43523|P.|2130966478|29200|2305|
11:22:11.618599|tcp|10.20.6.40|43523|192.0.2.10|443|.|1528286081|64240|0|
11:22:11.669481|tcp|10.20.6.40|43523|192.0.2.10|443|P.|1528286081|64240|826|
11:22:11.671276|tcp|192.0.2.10|443|10.20.6.40|43523|P.|2130968783|29200|1584|
11:22:11.671576|tcp|10.20.6.40|43523|192.0.2.10|443|.|1528286907|64240|0|
11:22:11.691576|tcp|10.20.6.40|43523|192.0.2.10|443|F.|1528286907|64240|0|
11:22:11.692076|tcp|192.0.2.10|443|10.20.6.40|43523|F.|2130970367|29200|0|
11:22:11.692276|tcp|10.20.6.40|43523|192.0.2.10|443|.|1528286908|64240|0|
11:22:14.276504|udp|10.20.6.40|49019|10.20.1.10|53|q|47212|0|63|47212+ A? rmg-backup-01.ridgelinemed.example.
11:22:14.279339|udp|10.20.1.10|53|10.20.6.40|49019|r|47212|0|79|47212 1/0/0 A 10.20.9.15
11:22:20.563516|tcp|198.51.100.202|48751|10.20.6.40|445|S|138804172|62720|0|
11:22:20.564031|tcp|10.20.6.40|445|198.51.100.202|48751|R.|0|0|0|
11:22:26.272644|tcp|198.51.100.202|37336|10.20.6.40|5900|S|366172759|62720|0|
11:22:26.273118|tcp|10.20.6.40|5900|198.51.100.202|37336|R.|0|0|0|
11:22:28.891960|tcp|198.51.100.202|51750|10.20.6.40|135|S|3784154931|65535|0|
11:22:28.892333|tcp|10.20.6.40|135|198.51.100.202|51750|R.|0|0|0|
11:22:29.881333|tcp|198.51.100.202|59922|10.20.6.40|3306|S|670846626|62720|0|
11:22:29.881636|tcp|10.20.6.40|3306|198.51.100.202|59922|R.|0|0|0|
11:22:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 42
11:22:31.000768|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 42
11:22:32.997193|tcp|198.51.100.202|35064|10.20.6.40|21|S|3562543573|65535|0|
11:22:32.997449|tcp|10.20.6.40|21|198.51.100.202|35064|R.|0|0|0|
11:22:50.044989|tcp|10.20.4.31|57163|10.20.6.40|443|S|763942089|29200|0|
11:22:50.045638|tcp|10.20.6.40|443|10.20.4.31|57163|S.|3685153613|65535|0|
11:22:50.046487|tcp|10.20.4.31|57163|10.20.6.40|443|.|763942090|29200|0|
11:22:50.070130|tcp|10.20.4.31|57163|10.20.6.40|443|P.|763942090|29200|1367|TLS SNI: portal.ridgelinemed.example
11:22:50.074977|tcp|10.20.6.40|443|10.20.4.31|57163|P.|3685153614|65535|1107|
11:22:50.075277|tcp|10.20.4.31|57163|10.20.6.40|443|.|763943457|29200|0|
11:22:50.128415|tcp|10.20.4.31|57163|10.20.6.40|443|P.|763943457|29200|947|
11:22:50.131383|tcp|10.20.6.40|443|10.20.4.31|57163|P.|3685154721|65535|2128|
11:22:50.131683|tcp|10.20.4.31|57163|10.20.6.40|443|.|763944404|29200|0|
11:22:50.173775|tcp|10.20.4.31|57163|10.20.6.40|443|P.|763944404|29200|895|
11:22:50.175110|tcp|10.20.6.40|443|10.20.4.31|57163|P.|3685156849|65535|2006|
11:22:50.175410|tcp|10.20.4.31|57163|10.20.6.40|443|.|763945299|29200|0|
11:22:50.212190|tcp|10.20.4.31|57163|10.20.6.40|443|P.|763945299|29200|1288|
11:22:50.217876|tcp|10.20.6.40|443|10.20.4.31|57163|P.|3685158855|65535|1834|
11:22:50.218176|tcp|10.20.4.31|57163|10.20.6.40|443|.|763946587|29200|0|
11:22:50.245981|tcp|10.20.4.31|57163|10.20.6.40|443|P.|763946587|29200|1389|
11:22:50.249653|tcp|10.20.6.40|443|10.20.4.31|57163|P.|3685160689|65535|2433|
11:22:50.249953|tcp|10.20.4.31|57163|10.20.6.40|443|.|763947976|29200|0|
11:22:50.267286|tcp|10.20.4.31|57163|10.20.6.40|443|P.|763947976|29200|923|
11:22:50.272790|tcp|10.20.6.40|443|10.20.4.31|57163|P.|3685163122|65535|2302|
11:22:50.273090|tcp|10.20.4.31|57163|10.20.6.40|443|.|763948899|29200|0|
11:22:50.326793|tcp|10.20.4.31|57163|10.20.6.40|443|P.|763948899|29200|911|
11:22:50.329735|tcp|10.20.6.40|443|10.20.4.31|57163|P.|3685165424|65535|1953|
11:22:50.330035|tcp|10.20.4.31|57163|10.20.6.40|443|.|763949810|29200|0|
11:22:50.357000|tcp|10.20.4.31|57163|10.20.6.40|443|P.|763949810|29200|1003|
11:22:50.360511|tcp|10.20.6.40|443|10.20.4.31|57163|P.|3685167377|65535|2131|
11:22:50.360811|tcp|10.20.4.31|57163|10.20.6.40|443|.|763950813|29200|0|
11:22:50.380811|tcp|10.20.4.31|57163|10.20.6.40|443|F.|763950813|29200|0|
11:22:50.381311|tcp|10.20.6.40|443|10.20.4.31|57163|F.|3685169508|65535|0|
11:22:50.381511|tcp|10.20.4.31|57163|10.20.6.40|443|.|763950814|29200|0|
11:23:02.825835|udp|10.20.6.40|41446|10.20.1.10|53|q|34698|0|64|34698+ A? rmg-monitor-01.ridgelinemed.example.
11:23:02.828629|udp|10.20.1.10|53|10.20.6.40|41446|r|34698|0|80|34698 1/0/0 A 10.20.9.40
11:23:07.000000|tcp|10.20.9.40|35398|10.20.6.40|9100|S|3069616270|65535|0|
11:23:07.001013|tcp|10.20.6.40|9100|10.20.9.40|35398|S.|1887731577|65535|0|
11:23:07.001236|tcp|10.20.9.40|35398|10.20.6.40|9100|.|3069616271|65535|0|
11:23:07.012641|tcp|10.20.9.40|35398|10.20.6.40|9100|P.|3069616271|65535|532|GET /metrics HTTP/1.1
11:23:07.017244|tcp|10.20.6.40|9100|10.20.9.40|35398|P.|1887731578|65535|877|
11:23:07.017544|tcp|10.20.9.40|35398|10.20.6.40|9100|.|3069616803|65535|0|
11:23:07.037544|tcp|10.20.9.40|35398|10.20.6.40|9100|F.|3069616803|65535|0|
11:23:07.038044|tcp|10.20.6.40|9100|10.20.9.40|35398|F.|1887732455|65535|0|
11:23:07.038244|tcp|10.20.9.40|35398|10.20.6.40|9100|.|3069616804|65535|0|
11:23:45.860018|udp|10.20.6.40|36735|10.20.1.10|53|q|61406|0|63|61406+ A? rmg-backup-01.ridgelinemed.example.
11:23:45.862955|udp|10.20.1.10|53|10.20.6.40|36735|r|61406|0|79|61406 1/0/0 A 10.20.9.15
11:24:07.000000|tcp|10.20.9.40|34372|10.20.6.40|9100|S|834173385|65535|0|
11:24:07.000727|tcp|10.20.6.40|9100|10.20.9.40|34372|S.|659519153|62720|0|
11:24:07.001446|tcp|10.20.9.40|34372|10.20.6.40|9100|.|834173386|65535|0|
11:24:07.011535|tcp|10.20.9.40|34372|10.20.6.40|9100|P.|834173386|65535|806|GET /metrics HTTP/1.1
11:24:07.013829|tcp|10.20.6.40|9100|10.20.9.40|34372|P.|659519154|62720|1650|
11:24:07.014129|tcp|10.20.9.40|34372|10.20.6.40|9100|.|834174192|65535|0|
11:24:07.034129|tcp|10.20.9.40|34372|10.20.6.40|9100|F.|834174192|65535|0|
11:24:07.034629|tcp|10.20.6.40|9100|10.20.9.40|34372|F.|659520804|62720|0|
11:24:07.034829|tcp|10.20.9.40|34372|10.20.6.40|9100|.|834174193|65535|0|
11:24:26.988943|tcp|10.20.4.58|39253|10.20.6.40|443|S|3805446190|64240|0|
11:24:26.989934|tcp|10.20.6.40|443|10.20.4.58|39253|S.|1531030429|64240|0|
11:24:26.990680|tcp|10.20.4.58|39253|10.20.6.40|443|.|3805446191|64240|0|
11:24:27.028119|tcp|10.20.4.58|39253|10.20.6.40|443|P.|3805446191|64240|1357|TLS SNI: portal.ridgelinemed.example
11:24:27.030110|tcp|10.20.6.40|443|10.20.4.58|39253|P.|1531030430|64240|1949|
11:24:27.030410|tcp|10.20.4.58|39253|10.20.6.40|443|.|3805447548|64240|0|
11:24:27.068716|tcp|10.20.4.58|39253|10.20.6.40|443|P.|3805447548|64240|1371|
11:24:27.071288|tcp|10.20.6.40|443|10.20.4.58|39253|P.|1531032379|64240|1132|
11:24:27.071588|tcp|10.20.4.58|39253|10.20.6.40|443|.|3805448919|64240|0|
11:24:27.116703|tcp|10.20.4.58|39253|10.20.6.40|443|P.|3805448919|64240|1256|
11:24:27.121027|tcp|10.20.6.40|443|10.20.4.58|39253|P.|1531033511|64240|2759|
11:24:27.121327|tcp|10.20.4.58|39253|10.20.6.40|443|.|3805450175|64240|0|
11:24:27.141327|tcp|10.20.4.58|39253|10.20.6.40|443|F.|3805450175|64240|0|
11:24:27.141827|tcp|10.20.6.40|443|10.20.4.58|39253|F.|1531036270|64240|0|
11:24:27.142027|tcp|10.20.4.58|39253|10.20.6.40|443|.|3805450176|64240|0|
11:24:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 43
11:24:31.000743|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 43
11:24:33.140332|udp|10.20.6.40|43119|10.20.1.10|53|q|40994|0|39|40994+ A? ubuntu.com.
11:24:33.143422|udp|10.20.1.10|53|10.20.6.40|43119|r|40994|0|55|40994 1/0/0 A 192.0.2.30
11:25:07.000000|tcp|10.20.9.40|36525|10.20.6.40|9100|S|2381243610|65535|0|
11:25:07.001207|tcp|10.20.6.40|9100|10.20.9.40|36525|S.|625279317|62720|0|
11:25:07.002100|tcp|10.20.9.40|36525|10.20.6.40|9100|.|2381243611|65535|0|
11:25:07.049094|tcp|10.20.9.40|36525|10.20.6.40|9100|P.|2381243611|65535|884|GET /metrics HTTP/1.1
11:25:07.051605|tcp|10.20.6.40|9100|10.20.9.40|36525|P.|625279318|62720|1283|
11:25:07.051905|tcp|10.20.9.40|36525|10.20.6.40|9100|.|2381244495|65535|0|
11:25:07.071905|tcp|10.20.9.40|36525|10.20.6.40|9100|F.|2381244495|65535|0|
11:25:07.072405|tcp|10.20.6.40|9100|10.20.9.40|36525|F.|625280601|62720|0|
11:25:07.072605|tcp|10.20.9.40|36525|10.20.6.40|9100|.|2381244496|65535|0|
11:25:11.587730|udp|10.20.6.40|44074|10.20.1.10|53|q|44389|0|40|44389+ A? example.com.
11:25:11.591660|udp|10.20.1.10|53|10.20.6.40|44074|r|44389|0|56|44389 1/0/0 A 192.0.2.10
11:25:41.000000|tcp|10.20.6.40|59309|203.0.113.55|443|S|1559299794|64240|0|
11:25:41.001230|tcp|203.0.113.55|443|10.20.6.40|59309|S.|3948559028|62720|0|
11:25:41.002007|tcp|10.20.6.40|59309|203.0.113.55|443|.|1559299795|64240|0|
11:25:41.053892|tcp|10.20.6.40|59309|203.0.113.55|443|P.|1559299795|64240|206|TLS SNI: cdn-sync.example
11:25:41.059122|tcp|203.0.113.55|443|10.20.6.40|59309|P.|3948559029|62720|610|
11:25:41.059422|tcp|10.20.6.40|59309|203.0.113.55|443|.|1559300001|64240|0|
11:25:41.079422|tcp|10.20.6.40|59309|203.0.113.55|443|F.|1559300001|64240|0|
11:25:41.079922|tcp|203.0.113.55|443|10.20.6.40|59309|F.|3948559639|62720|0|
11:25:41.080122|tcp|10.20.6.40|59309|203.0.113.55|443|.|1559300002|64240|0|
11:25:42.904031|tcp|203.0.113.201|47744|10.20.6.40|5900|S|2461841991|29200|0|
11:25:42.904354|tcp|10.20.6.40|5900|203.0.113.201|47744|R.|0|0|0|
11:25:49.584068|tcp|203.0.113.201|45461|10.20.6.40|3306|S|2634461045|65535|0|
11:25:49.584491|tcp|10.20.6.40|3306|203.0.113.201|45461|R.|0|0|0|
11:25:50.606608|tcp|203.0.113.201|38020|10.20.6.40|25|S|390289567|29200|0|
11:25:50.606875|tcp|10.20.6.40|25|203.0.113.201|38020|R.|0|0|0|
11:25:52.325005|tcp|203.0.113.201|36786|10.20.6.40|110|S|1266553211|65535|0|
11:25:52.325530|tcp|10.20.6.40|110|203.0.113.201|36786|R.|0|0|0|
11:25:52.420279|udp|10.20.6.40|41814|10.20.1.10|53|q|52050|0|40|52050+ A? example.com.
11:25:52.422372|udp|10.20.1.10|53|10.20.6.40|41814|r|52050|0|56|52050 1/0/0 A 192.0.2.10
11:25:57.479668|tcp|203.0.113.201|45381|10.20.6.40|1433|S|779415263|29200|0|
11:25:57.480190|tcp|10.20.6.40|1433|203.0.113.201|45381|R.|0|0|0|
11:26:04.713869|tcp|203.0.113.201|57707|10.20.6.40|135|S|3904420893|62720|0|
11:26:04.714288|tcp|10.20.6.40|135|203.0.113.201|57707|R.|0|0|0|
11:26:07.000000|tcp|10.20.9.40|33160|10.20.6.40|9100|S|1567017254|64240|0|
11:26:07.001309|tcp|10.20.6.40|9100|10.20.9.40|33160|S.|250323086|65535|0|
11:26:07.002206|tcp|10.20.9.40|33160|10.20.6.40|9100|.|1567017255|64240|0|
11:26:07.046707|tcp|10.20.9.40|33160|10.20.6.40|9100|P.|1567017255|64240|804|GET /metrics HTTP/1.1
11:26:07.048589|tcp|10.20.6.40|9100|10.20.9.40|33160|P.|250323087|65535|453|
11:26:07.048889|tcp|10.20.9.40|33160|10.20.6.40|9100|.|1567018059|64240|0|
11:26:07.068889|tcp|10.20.9.40|33160|10.20.6.40|9100|F.|1567018059|64240|0|
11:26:07.069389|tcp|10.20.6.40|9100|10.20.9.40|33160|F.|250323540|65535|0|
11:26:07.069589|tcp|10.20.9.40|33160|10.20.6.40|9100|.|1567018060|64240|0|
11:26:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 44
11:26:31.000569|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 44
11:26:58.709198|udp|10.20.6.40|55549|10.20.1.10|53|q|22877|0|63|22877+ A? rmg-backup-01.ridgelinemed.example.
11:26:58.711452|udp|10.20.1.10|53|10.20.6.40|55549|r|22877|0|79|22877 1/0/0 A 10.20.9.15
11:27:07.000000|tcp|10.20.9.40|41580|10.20.6.40|9100|S|2516325172|65535|0|
11:27:07.001181|tcp|10.20.6.40|9100|10.20.9.40|41580|S.|793459812|65535|0|
11:27:07.001537|tcp|10.20.9.40|41580|10.20.6.40|9100|.|2516325173|65535|0|
11:27:07.018435|tcp|10.20.9.40|41580|10.20.6.40|9100|P.|2516325173|65535|527|GET /metrics HTTP/1.1
11:27:07.019462|tcp|10.20.6.40|9100|10.20.9.40|41580|P.|793459813|65535|908|
11:27:07.019762|tcp|10.20.9.40|41580|10.20.6.40|9100|.|2516325700|65535|0|
11:27:07.039762|tcp|10.20.9.40|41580|10.20.6.40|9100|F.|2516325700|65535|0|
11:27:07.040262|tcp|10.20.6.40|9100|10.20.9.40|41580|F.|793460721|65535|0|
11:27:07.040462|tcp|10.20.9.40|41580|10.20.6.40|9100|.|2516325701|65535|0|
11:27:49.052028|udp|10.20.6.40|36464|10.20.1.10|53|q|39578|0|40|39578+ A? example.com.
11:27:49.054528|udp|10.20.1.10|53|10.20.6.40|36464|r|39578|0|56|39578 1/0/0 A 192.0.2.10
11:28:07.000000|tcp|10.20.9.40|49756|10.20.6.40|9100|S|2905361967|62720|0|
11:28:07.000503|tcp|10.20.6.40|9100|10.20.9.40|49756|S.|450267558|62720|0|
11:28:07.001023|tcp|10.20.9.40|49756|10.20.6.40|9100|.|2905361968|62720|0|
11:28:07.060575|tcp|10.20.9.40|49756|10.20.6.40|9100|P.|2905361968|62720|765|GET /metrics HTTP/1.1
11:28:07.064809|tcp|10.20.6.40|9100|10.20.9.40|49756|P.|450267559|62720|1326|
11:28:07.065109|tcp|10.20.9.40|49756|10.20.6.40|9100|.|2905362733|62720|0|
11:28:07.085109|tcp|10.20.9.40|49756|10.20.6.40|9100|F.|2905362733|62720|0|
11:28:07.085609|tcp|10.20.6.40|9100|10.20.9.40|49756|F.|450268885|62720|0|
11:28:07.085809|tcp|10.20.9.40|49756|10.20.6.40|9100|.|2905362734|62720|0|
11:28:09.000000|tcp|10.20.6.40|48674|198.51.100.60|443|S|2465094801|64240|0|
11:28:09.000814|tcp|198.51.100.60|443|10.20.6.40|48674|S.|1569379060|64240|0|
11:28:09.001067|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465094802|64240|0|
11:28:09.834118|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465094802|64240|799|TLS SNI: updates-cdn.example
11:28:09.835853|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569379061|64240|1917|
11:28:09.836153|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465095601|64240|0|
11:28:11.152487|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465095601|64240|1383|
11:28:11.155239|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569380978|64240|1348|
11:28:11.155539|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465096984|64240|0|
11:28:12.231057|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465096984|64240|802|
11:28:12.232210|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569382326|64240|2082|
11:28:12.232510|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465097786|64240|0|
11:28:13.586865|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465097786|64240|813|
11:28:13.588857|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569384408|64240|2673|
11:28:13.589157|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465098599|64240|0|
11:28:14.831993|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465098599|64240|820|
11:28:14.837828|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569387081|64240|2343|
11:28:14.838128|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465099419|64240|0|
11:28:15.783556|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465099419|64240|1234|
11:28:15.788793|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569389424|64240|1470|
11:28:15.789093|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465100653|64240|0|
11:28:16.323327|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465100653|64240|829|
11:28:16.325309|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569390894|64240|1069|
11:28:16.325609|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465101482|64240|0|
11:28:17.566461|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465101482|64240|890|
11:28:17.572430|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569391963|64240|1968|
11:28:17.572730|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465102372|64240|0|
11:28:18.512377|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465102372|64240|1333|
11:28:18.513625|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569393931|64240|2013|
11:28:18.513925|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465103705|64240|0|
11:28:19.173316|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465103705|64240|1188|
11:28:19.177424|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569395944|64240|936|
11:28:19.177724|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465104893|64240|0|
11:28:20.204372|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465104893|64240|912|
11:28:20.207918|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569396880|64240|1275|
11:28:20.208218|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465105805|64240|0|
11:28:20.687656|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465105805|64240|1052|
11:28:20.693527|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569398155|64240|2220|
11:28:20.693827|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465106857|64240|0|
11:28:21.718928|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465106857|64240|887|
11:28:21.720577|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569400375|64240|1741|
11:28:21.720877|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465107744|64240|0|
11:28:22.866168|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465107744|64240|810|
11:28:22.868795|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569402116|64240|2198|
11:28:22.869095|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465108554|64240|0|
11:28:23.372680|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465108554|64240|1000|
11:28:23.373699|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569404314|64240|1743|
11:28:23.373999|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465109554|64240|0|
11:28:24.359035|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465109554|64240|1306|
11:28:24.363997|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569406057|64240|1208|
11:28:24.364297|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465110860|64240|0|
11:28:25.449362|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465110860|64240|1074|
11:28:25.450526|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569407265|64240|1266|
11:28:25.450826|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465111934|64240|0|
11:28:26.281861|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465111934|64240|1057|
11:28:26.285168|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569408531|64240|2415|
11:28:26.285468|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465112991|64240|0|
11:28:27.375375|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465112991|64240|776|
11:28:27.380627|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569410946|64240|2002|
11:28:27.380927|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465113767|64240|0|
11:28:28.753964|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465113767|64240|743|
11:28:28.759805|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569412948|64240|775|
11:28:28.760105|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465114510|64240|0|
11:28:29.419017|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465114510|64240|1251|
11:28:29.424553|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569413723|64240|2387|
11:28:29.424853|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465115761|64240|0|
11:28:30.247583|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465115761|64240|1125|
11:28:30.253299|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569416110|64240|2529|
11:28:30.253599|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465116886|64240|0|
11:28:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 45
11:28:31.000581|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 45
11:28:31.565843|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465116886|64240|1118|
11:28:31.569253|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569418639|64240|2071|
11:28:31.569553|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465118004|64240|0|
11:28:32.309770|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465118004|64240|1035|
11:28:32.311610|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569420710|64240|2309|
11:28:32.311910|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465119039|64240|0|
11:28:33.403567|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465119039|64240|933|
11:28:33.406212|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569423019|64240|2037|
11:28:33.406512|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465119972|64240|0|
11:28:34.686357|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465119972|64240|1189|
11:28:34.687393|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569425056|64240|838|
11:28:34.687693|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465121161|64240|0|
11:28:36.006105|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465121161|64240|1235|
11:28:36.007984|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569425894|64240|2235|
11:28:36.008284|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465122396|64240|0|
11:28:36.638833|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465122396|64240|1083|
11:28:36.642176|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569428129|64240|1625|
11:28:36.642476|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465123479|64240|0|
11:28:37.380384|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465123479|64240|1032|
11:28:37.381622|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569429754|64240|1537|
11:28:37.381922|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465124511|64240|0|
11:28:38.421630|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465124511|64240|861|
11:28:38.423950|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569431291|64240|1246|
11:28:38.424250|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465125372|64240|0|
11:28:39.250941|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465125372|64240|900|
11:28:39.256905|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569432537|64240|1080|
11:28:39.257205|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465126272|64240|0|
11:28:40.182736|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465126272|64240|910|
11:28:40.184938|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569433617|64240|2380|
11:28:40.185238|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465127182|64240|0|
11:28:41.134701|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465127182|64240|1319|
11:28:41.139905|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569435997|64240|2473|
11:28:41.140205|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465128501|64240|0|
11:28:41.742116|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465128501|64240|832|
11:28:41.743368|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569438470|64240|1449|
11:28:41.743668|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465129333|64240|0|
11:28:43.039068|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465129333|64240|892|
11:28:43.041893|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569439919|64240|1613|
11:28:43.042193|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465130225|64240|0|
11:28:43.556434|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465130225|64240|1302|
11:28:43.562098|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569441532|64240|1546|
11:28:43.562398|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465131527|64240|0|
11:28:44.295378|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465131527|64240|987|
11:28:44.300311|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569443078|64240|1317|
11:28:44.300611|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465132514|64240|0|
11:28:45.557095|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465132514|64240|972|
11:28:45.560170|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569444395|64240|2708|
11:28:45.560470|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465133486|64240|0|
11:28:46.036795|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465133486|64240|1164|
11:28:46.039383|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569447103|64240|1264|
11:28:46.039683|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465134650|64240|0|
11:28:46.889325|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465134650|64240|967|
11:28:46.893277|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569448367|64240|1959|
11:28:46.893577|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465135617|64240|0|
11:28:47.409793|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465135617|64240|1247|
11:28:47.412371|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569450326|64240|1542|
11:28:47.412671|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465136864|64240|0|
11:28:48.650732|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465136864|64240|761|
11:28:48.654919|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569451868|64240|1656|
11:28:48.655219|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465137625|64240|0|
11:28:49.441833|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465137625|64240|834|
11:28:49.445542|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569453524|64240|1285|
11:28:49.445842|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465138459|64240|0|
11:28:50.290672|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465138459|64240|1317|
11:28:50.295475|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569454809|64240|2435|
11:28:50.295775|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465139776|64240|0|
11:28:51.311748|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465139776|64240|1311|
11:28:51.316340|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569457244|64240|1441|
11:28:51.316640|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465141087|64240|0|
11:28:52.023697|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465141087|64240|1092|
11:28:52.025313|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569458685|64240|2474|
11:28:52.025613|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465142179|64240|0|
11:28:53.182077|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465142179|64240|1261|
11:28:53.186036|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569461159|64240|2251|
11:28:53.186336|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465143440|64240|0|
11:28:54.406095|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465143440|64240|909|
11:28:54.410420|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569463410|64240|1106|
11:28:54.410720|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465144349|64240|0|
11:28:55.297071|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465144349|64240|882|
11:28:55.301445|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569464516|64240|1049|
11:28:55.301745|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465145231|64240|0|
11:28:55.852068|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465145231|64240|1079|
11:28:55.855111|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569465565|64240|1052|
11:28:55.855411|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465146310|64240|0|
11:28:56.637313|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465146310|64240|796|
11:28:56.642821|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569466617|64240|2641|
11:28:56.643121|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465147106|64240|0|
11:28:57.284285|udp|10.20.6.40|57404|10.20.1.10|53|q|15556|0|40|15556+ A? example.com.
11:28:57.286646|udp|10.20.1.10|53|10.20.6.40|57404|r|15556|0|56|15556 1/0/0 A 192.0.2.10
11:28:57.373846|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465147106|64240|766|
11:28:57.378867|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569469258|64240|2556|
11:28:57.379167|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465147872|64240|0|
11:28:58.392300|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465147872|64240|892|
11:28:58.394432|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569471814|64240|933|
11:28:58.394732|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465148764|64240|0|
11:28:59.097840|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465148764|64240|1044|
11:28:59.101420|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569472747|64240|2399|
11:28:59.101720|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465149808|64240|0|
11:28:59.975382|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465149808|64240|1318|
11:28:59.976540|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569475146|64240|2788|
11:28:59.976840|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465151126|64240|0|
11:29:01.062948|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465151126|64240|1190|
11:29:01.063989|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569477934|64240|1923|
11:29:01.064289|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465152316|64240|0|
11:29:02.324434|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465152316|64240|705|
11:29:02.328024|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569479857|64240|713|
11:29:02.328324|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465153021|64240|0|
11:29:02.900674|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465153021|64240|918|
11:29:02.905505|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569480570|64240|2551|
11:29:02.905805|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465153939|64240|0|
11:29:03.563936|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465153939|64240|1276|
11:29:03.565886|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569483121|64240|2680|
11:29:03.566186|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465155215|64240|0|
11:29:04.926483|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465155215|64240|1127|
11:29:04.930117|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569485801|64240|1202|
11:29:04.930417|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465156342|64240|0|
11:29:06.209936|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465156342|64240|832|
11:29:06.214681|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569487003|64240|2449|
11:29:06.214981|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465157174|64240|0|
11:29:06.778966|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465157174|64240|753|
11:29:06.784593|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569489452|64240|1244|
11:29:06.784893|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465157927|64240|0|
11:29:07.000000|tcp|10.20.9.40|43887|10.20.6.40|9100|S|3608801040|65535|0|
11:29:07.000576|tcp|10.20.6.40|9100|10.20.9.40|43887|S.|3801008259|64240|0|
11:29:07.001348|tcp|10.20.9.40|43887|10.20.6.40|9100|.|3608801041|65535|0|
11:29:07.039650|tcp|10.20.9.40|43887|10.20.6.40|9100|P.|3608801041|65535|518|GET /metrics HTTP/1.1
11:29:07.042391|tcp|10.20.6.40|9100|10.20.9.40|43887|P.|3801008260|64240|850|
11:29:07.042691|tcp|10.20.9.40|43887|10.20.6.40|9100|.|3608801559|65535|0|
11:29:07.062691|tcp|10.20.9.40|43887|10.20.6.40|9100|F.|3608801559|65535|0|
11:29:07.063191|tcp|10.20.6.40|9100|10.20.9.40|43887|F.|3801009110|64240|0|
11:29:07.063391|tcp|10.20.9.40|43887|10.20.6.40|9100|.|3608801560|65535|0|
11:29:07.580522|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465157927|64240|1385|
11:29:07.584533|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569490696|64240|922|
11:29:07.584833|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465159312|64240|0|
11:29:08.913330|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465159312|64240|1061|
11:29:08.916116|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569491618|64240|1138|
11:29:08.916416|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465160373|64240|0|
11:29:09.656725|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465160373|64240|819|
11:29:09.659622|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569492756|64240|1138|
11:29:09.659922|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465161192|64240|0|
11:29:10.651103|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465161192|64240|738|
11:29:10.653573|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569493894|64240|1228|
11:29:10.653873|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465161930|64240|0|
11:29:11.634847|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465161930|64240|760|
11:29:11.640623|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569495122|64240|839|
11:29:11.640923|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465162690|64240|0|
11:29:12.177418|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465162690|64240|1354|
11:29:12.178909|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569495961|64240|1459|
11:29:12.179209|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465164044|64240|0|
11:29:13.269766|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465164044|64240|883|
11:29:13.272657|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569497420|64240|1819|
11:29:13.272957|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465164927|64240|0|
11:29:13.929545|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465164927|64240|1221|
11:29:13.935095|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569499239|64240|2031|
11:29:13.935395|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465166148|64240|0|
11:29:14.784877|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465166148|64240|915|
11:29:14.788856|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569501270|64240|2235|
11:29:14.789156|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465167063|64240|0|
11:29:15.883040|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465167063|64240|1040|
11:29:15.888176|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569503505|64240|2440|
11:29:15.888476|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465168103|64240|0|
11:29:17.012334|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465168103|64240|1235|
11:29:17.013532|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569505945|64240|1089|
11:29:17.013832|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465169338|64240|0|
11:29:17.595575|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465169338|64240|814|
11:29:17.600154|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569507034|64240|1082|
11:29:17.600454|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465170152|64240|0|
11:29:18.196679|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465170152|64240|1019|
11:29:18.201413|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569508116|64240|1904|
11:29:18.201713|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465171171|64240|0|
11:29:18.829829|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465171171|64240|959|
11:29:18.835214|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569510020|64240|725|
11:29:18.835514|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465172130|64240|0|
11:29:19.689681|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465172130|64240|1355|
11:29:19.691392|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569510745|64240|1270|
11:29:19.691692|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465173485|64240|0|
11:29:20.663049|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465173485|64240|1200|
11:29:20.667355|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569512015|64240|2037|
11:29:20.667655|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465174685|64240|0|
11:29:21.789021|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465174685|64240|990|
11:29:21.792963|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569514052|64240|1159|
11:29:21.793263|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465175675|64240|0|
11:29:22.546859|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465175675|64240|811|
11:29:22.551264|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569515211|64240|1787|
11:29:22.551564|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465176486|64240|0|
11:29:23.339240|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465176486|64240|1046|
11:29:23.340735|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569516998|64240|2331|
11:29:23.341035|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465177532|64240|0|
11:29:24.638803|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465177532|64240|948|
11:29:24.640380|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569519329|64240|2487|
11:29:24.640680|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465178480|64240|0|
11:29:25.317674|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465178480|64240|1197|
11:29:25.321702|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569521816|64240|2557|
11:29:25.322002|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465179677|64240|0|
11:29:26.245401|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465179677|64240|1336|
11:29:26.247160|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569524373|64240|1357|
11:29:26.247460|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465181013|64240|0|
11:29:27.113824|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465181013|64240|1170|
11:29:27.119393|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569525730|64240|2606|
11:29:27.119693|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465182183|64240|0|
11:29:27.734574|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465182183|64240|980|
11:29:27.736513|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569528336|64240|1100|
11:29:27.736813|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465183163|64240|0|
11:29:28.504017|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465183163|64240|1317|
11:29:28.509762|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569529436|64240|2030|
11:29:28.510062|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465184480|64240|0|
11:29:29.554180|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465184480|64240|703|
11:29:29.557197|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569531466|64240|1425|
11:29:29.557497|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465185183|64240|0|
11:29:30.150858|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465185183|64240|1031|
11:29:30.154520|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569532891|64240|1603|
11:29:30.154820|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465186214|64240|0|
11:29:30.854317|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465186214|64240|886|
11:29:30.856385|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569534494|64240|2275|
11:29:30.856685|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465187100|64240|0|
11:29:31.817567|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465187100|64240|1355|
11:29:31.819738|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569536769|64240|1436|
11:29:31.820038|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465188455|64240|0|
11:29:32.768082|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465188455|64240|1168|
11:29:32.773441|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569538205|64240|772|
11:29:32.773741|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465189623|64240|0|
11:29:32.798243|udp|10.20.6.40|34629|10.20.1.10|53|q|2139|0|56|2139+ A? portal.ridgelinemed.example.
11:29:32.801828|udp|10.20.1.10|53|10.20.6.40|34629|r|2139|0|72|2139 1/0/0 A 10.20.6.40
11:29:33.865135|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465189623|64240|1304|
11:29:33.867067|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569538977|64240|2598|
11:29:33.867367|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465190927|64240|0|
11:29:34.704995|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465190927|64240|1048|
11:29:34.708564|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569541575|64240|1811|
11:29:34.708864|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465191975|64240|0|
11:29:35.601452|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465191975|64240|703|
11:29:35.605517|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569543386|64240|2177|
11:29:35.605817|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465192678|64240|0|
11:29:36.366229|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465192678|64240|1022|
11:29:36.371756|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569545563|64240|2018|
11:29:36.372056|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465193700|64240|0|
11:29:37.413823|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465193700|64240|790|
11:29:37.418350|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569547581|64240|2055|
11:29:37.418650|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465194490|64240|0|
11:29:38.514863|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465194490|64240|1311|
11:29:38.517313|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569549636|64240|2474|
11:29:38.517613|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465195801|64240|0|
11:29:39.506420|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465195801|64240|1398|
11:29:39.507664|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569552110|64240|1473|
11:29:39.507964|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465197199|64240|0|
11:29:40.031343|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465197199|64240|1101|
11:29:40.032538|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569553583|64240|2301|
11:29:40.032838|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465198300|64240|0|
11:29:41.351117|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465198300|64240|840|
11:29:41.356817|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569555884|64240|2395|
11:29:41.357117|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465199140|64240|0|
11:29:42.080431|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465199140|64240|1022|
11:29:42.081576|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569558279|64240|2114|
11:29:42.081876|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465200162|64240|0|
11:29:42.726408|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465200162|64240|1129|
11:29:42.729069|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569560393|64240|1030|
11:29:42.729369|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465201291|64240|0|
11:29:43.321202|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465201291|64240|1049|
11:29:43.324524|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569561423|64240|1942|
11:29:43.324824|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465202340|64240|0|
11:29:44.070742|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465202340|64240|750|
11:29:44.072712|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569563365|64240|1086|
11:29:44.073012|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465203090|64240|0|
11:29:44.748938|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465203090|64240|1389|
11:29:44.753095|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569564451|64240|1699|
11:29:44.753395|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465204479|64240|0|
11:29:46.115527|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465204479|64240|1223|
11:29:46.117391|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569566150|64240|916|
11:29:46.117691|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465205702|64240|0|
11:29:46.942741|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465205702|64240|1352|
11:29:46.946987|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569567066|64240|1817|
11:29:46.947287|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465207054|64240|0|
11:29:47.677919|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465207054|64240|1340|
11:29:47.679020|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569568883|64240|1177|
11:29:47.679320|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465208394|64240|0|
11:29:48.497642|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465208394|64240|1013|
11:29:48.503201|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569570060|64240|1200|
11:29:48.503501|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465209407|64240|0|
11:29:49.288310|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465209407|64240|1341|
11:29:49.294143|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569571260|64240|1426|
11:29:49.294443|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465210748|64240|0|
11:29:50.348827|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465210748|64240|1359|
11:29:50.354760|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569572686|64240|2511|
11:29:50.355060|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465212107|64240|0|
11:29:50.936173|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465212107|64240|1114|
11:29:50.940032|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569575197|64240|2667|
11:29:50.940332|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465213221|64240|0|
11:29:51.472825|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465213221|64240|1355|
11:29:51.476251|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569577864|64240|1098|
11:29:51.476551|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465214576|64240|0|
11:29:52.053616|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465214576|64240|1329|
11:29:52.058261|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569578962|64240|2538|
11:29:52.058561|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465215905|64240|0|
11:29:53.391324|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465215905|64240|763|
11:29:53.397091|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569581500|64240|1462|
11:29:53.397391|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465216668|64240|0|
11:29:54.103946|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465216668|64240|1365|
11:29:54.108303|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569582962|64240|2342|
11:29:54.108603|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465218033|64240|0|
11:29:55.142677|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465218033|64240|1153|
11:29:55.143777|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569585304|64240|774|
11:29:55.144077|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465219186|64240|0|
11:29:56.094071|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465219186|64240|885|
11:29:56.099183|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569586078|64240|955|
11:29:56.099483|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465220071|64240|0|
11:29:56.851432|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465220071|64240|729|
11:29:56.853490|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569587033|64240|2371|
11:29:56.853790|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465220800|64240|0|
11:29:57.562123|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465220800|64240|941|
11:29:57.567378|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569589404|64240|1331|
11:29:57.567678|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465221741|64240|0|
11:29:58.686956|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465221741|64240|886|
11:29:58.692530|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569590735|64240|2702|
11:29:58.692830|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465222627|64240|0|
11:30:00.000297|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465222627|64240|720|
11:30:00.004728|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569593437|64240|1523|
11:30:00.005028|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465223347|64240|0|
11:30:00.624736|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465223347|64240|1109|
11:30:00.629980|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569594960|64240|800|
11:30:00.630280|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465224456|64240|0|
11:30:01.642046|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465224456|64240|869|
11:30:01.646722|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569595760|64240|2172|
11:30:01.647022|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465225325|64240|0|
11:30:02.231202|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465225325|64240|1087|
11:30:02.236262|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569597932|64240|1190|
11:30:02.236562|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465226412|64240|0|
11:30:03.466627|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465226412|64240|1006|
11:30:03.470392|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569599122|64240|1539|
11:30:03.470692|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465227418|64240|0|
11:30:04.540019|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465227418|64240|777|
11:30:04.541945|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569600661|64240|1135|
11:30:04.542245|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465228195|64240|0|
11:30:05.799723|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465228195|64240|802|
11:30:05.801934|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569601796|64240|1611|
11:30:05.802234|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465228997|64240|0|
11:30:06.407788|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465228997|64240|1063|
11:30:06.411251|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569603407|64240|928|
11:30:06.411551|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465230060|64240|0|
11:30:07.000000|tcp|10.20.9.40|44438|10.20.6.40|9100|S|2703359642|64240|0|
11:30:07.000928|tcp|10.20.6.40|9100|10.20.9.40|44438|S.|740633731|29200|0|
11:30:07.001424|tcp|10.20.9.40|44438|10.20.6.40|9100|.|2703359643|64240|0|
11:30:07.044899|tcp|10.20.9.40|44438|10.20.6.40|9100|P.|2703359643|64240|523|GET /metrics HTTP/1.1
11:30:07.046792|tcp|10.20.6.40|9100|10.20.9.40|44438|P.|740633732|29200|548|
11:30:07.047092|tcp|10.20.9.40|44438|10.20.6.40|9100|.|2703360166|64240|0|
11:30:07.067092|tcp|10.20.9.40|44438|10.20.6.40|9100|F.|2703360166|64240|0|
11:30:07.067592|tcp|10.20.6.40|9100|10.20.9.40|44438|F.|740634280|29200|0|
11:30:07.067792|tcp|10.20.9.40|44438|10.20.6.40|9100|.|2703360167|64240|0|
11:30:07.766979|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465230060|64240|1044|
11:30:07.768236|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569604335|64240|1292|
11:30:07.768536|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465231104|64240|0|
11:30:08.707742|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465231104|64240|814|
11:30:08.710879|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569605627|64240|1303|
11:30:08.711179|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465231918|64240|0|
11:30:10.093784|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465231918|64240|745|
11:30:10.096673|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569606930|64240|1488|
11:30:10.096973|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465232663|64240|0|
11:30:10.862817|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465232663|64240|1317|
11:30:10.864748|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569608418|64240|985|
11:30:10.865048|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465233980|64240|0|
11:30:11.385078|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465233980|64240|1375|
11:30:11.389172|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569609403|64240|1757|
11:30:11.389472|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465235355|64240|0|
11:30:12.768197|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465235355|64240|1090|
11:30:12.770854|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569611160|64240|923|
11:30:12.771154|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465236445|64240|0|
11:30:13.299792|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465236445|64240|1286|
11:30:13.300821|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569612083|64240|2226|
11:30:13.301121|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465237731|64240|0|
11:30:14.632883|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465237731|64240|842|
11:30:14.635784|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569614309|64240|1230|
11:30:14.636084|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465238573|64240|0|
11:30:15.956950|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465238573|64240|810|
11:30:15.962571|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569615539|64240|1586|
11:30:15.962871|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465239383|64240|0|
11:30:16.715740|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465239383|64240|928|
11:30:16.718413|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569617125|64240|2530|
11:30:16.718713|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465240311|64240|0|
11:30:17.560273|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465240311|64240|1095|
11:30:17.565806|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569619655|64240|2607|
11:30:17.566106|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465241406|64240|0|
11:30:18.099041|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465241406|64240|1333|
11:30:18.100748|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569622262|64240|740|
11:30:18.101048|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465242739|64240|0|
11:30:19.203952|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465242739|64240|755|
11:30:19.208537|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569623002|64240|2262|
11:30:19.208837|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465243494|64240|0|
11:30:20.274032|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465243494|64240|968|
11:30:20.276522|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569625264|64240|809|
11:30:20.276822|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465244462|64240|0|
11:30:21.392488|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465244462|64240|1290|
11:30:21.396423|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569626073|64240|1059|
11:30:21.396723|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465245752|64240|0|
11:30:22.577594|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465245752|64240|998|
11:30:22.582570|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569627132|64240|2625|
11:30:22.582870|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465246750|64240|0|
11:30:23.192151|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465246750|64240|1017|
11:30:23.198106|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569629757|64240|2250|
11:30:23.198406|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465247767|64240|0|
11:30:24.270528|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465247767|64240|716|
11:30:24.273146|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569632007|64240|2346|
11:30:24.273446|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465248483|64240|0|
11:30:25.312933|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465248483|64240|1027|
11:30:25.315770|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569634353|64240|1554|
11:30:25.316070|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465249510|64240|0|
11:30:26.568562|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465249510|64240|818|
11:30:26.572123|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569635907|64240|1451|
11:30:26.572423|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465250328|64240|0|
11:30:26.682768|udp|10.20.6.40|59233|10.20.1.10|53|q|40502|0|39|40502+ A? ubuntu.com.
11:30:26.685929|udp|10.20.1.10|53|10.20.6.40|59233|r|40502|0|55|40502 1/0/0 A 192.0.2.30
11:30:27.967472|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465250328|64240|1159|
11:30:27.973046|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569637358|64240|2556|
11:30:27.973346|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465251487|64240|0|
11:30:28.701086|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465251487|64240|1380|
11:30:28.702622|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569639914|64240|1034|
11:30:28.702922|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465252867|64240|0|
11:30:29.463782|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465252867|64240|1213|
11:30:29.469133|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569640948|64240|1149|
11:30:29.469433|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465254080|64240|0|
11:30:30.313302|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465254080|64240|869|
11:30:30.314833|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569642097|64240|1636|
11:30:30.315133|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465254949|64240|0|
11:30:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 46
11:30:31.000631|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 46
11:30:31.580809|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465254949|64240|938|
11:30:31.583207|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569643733|64240|2679|
11:30:31.583507|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465255887|64240|0|
11:30:32.831675|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465255887|64240|955|
11:30:32.837026|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569646412|64240|851|
11:30:32.837326|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465256842|64240|0|
11:30:33.610585|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465256842|64240|1373|
11:30:33.616423|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569647263|64240|1736|
11:30:33.616723|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465258215|64240|0|
11:30:34.123478|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465258215|64240|1098|
11:30:34.127727|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569648999|64240|889|
11:30:34.128027|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465259313|64240|0|
11:30:35.485358|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465259313|64240|811|
11:30:35.490327|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569649888|64240|1730|
11:30:35.490627|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465260124|64240|0|
11:30:36.843573|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465260124|64240|752|
11:30:36.848284|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569651618|64240|738|
11:30:36.848584|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465260876|64240|0|
11:30:37.918376|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465260876|64240|1370|
11:30:37.920201|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569652356|64240|2777|
11:30:37.920501|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465262246|64240|0|
11:30:38.675969|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465262246|64240|1018|
11:30:38.677141|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569655133|64240|1089|
11:30:38.677441|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465263264|64240|0|
11:30:40.007725|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465263264|64240|710|
11:30:40.013603|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569656222|64240|2419|
11:30:40.013903|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465263974|64240|0|
11:30:41.000000|tcp|10.20.6.40|49410|203.0.113.55|443|S|3365689984|64240|0|
11:30:41.001039|tcp|203.0.113.55|443|10.20.6.40|49410|S.|1943935574|62720|0|
11:30:41.001794|tcp|10.20.6.40|49410|203.0.113.55|443|.|3365689985|64240|0|
11:30:41.017314|tcp|10.20.6.40|49410|203.0.113.55|443|P.|3365689985|64240|229|TLS SNI: cdn-sync.example
11:30:41.021298|tcp|203.0.113.55|443|10.20.6.40|49410|P.|1943935575|62720|455|
11:30:41.021598|tcp|10.20.6.40|49410|203.0.113.55|443|.|3365690214|64240|0|
11:30:41.041598|tcp|10.20.6.40|49410|203.0.113.55|443|F.|3365690214|64240|0|
11:30:41.042098|tcp|203.0.113.55|443|10.20.6.40|49410|F.|1943936030|62720|0|
11:30:41.042298|tcp|10.20.6.40|49410|203.0.113.55|443|.|3365690215|64240|0|
11:30:41.281344|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465263974|64240|1274|
11:30:41.283429|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569658641|64240|1614|
11:30:41.283729|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465265248|64240|0|
11:30:42.214681|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465265248|64240|928|
11:30:42.216891|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569660255|64240|1074|
11:30:42.217191|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465266176|64240|0|
11:30:42.969125|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465266176|64240|827|
11:30:42.972455|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569661329|64240|1392|
11:30:42.972755|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465267003|64240|0|
11:30:44.118673|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465267003|64240|1134|
11:30:44.120843|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569662721|64240|2301|
11:30:44.121143|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465268137|64240|0|
11:30:45.108550|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465268137|64240|1320|
11:30:45.109803|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569665022|64240|1825|
11:30:45.110103|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465269457|64240|0|
11:30:45.912044|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465269457|64240|822|
11:30:45.917546|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569666847|64240|1603|
11:30:45.917846|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465270279|64240|0|
11:30:46.528595|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465270279|64240|828|
11:30:46.531810|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569668450|64240|2743|
11:30:46.532110|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465271107|64240|0|
11:30:47.502216|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465271107|64240|1007|
11:30:47.506375|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569671193|64240|2417|
11:30:47.506675|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465272114|64240|0|
11:30:48.803923|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465272114|64240|1095|
11:30:48.809333|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569673610|64240|1990|
11:30:48.809633|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465273209|64240|0|
11:30:50.043260|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465273209|64240|918|
11:30:50.049047|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569675600|64240|1642|
11:30:50.049347|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465274127|64240|0|
11:30:50.937257|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465274127|64240|1193|
11:30:50.939604|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569677242|64240|1592|
11:30:50.939904|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465275320|64240|0|
11:30:51.770361|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465275320|64240|716|
11:30:51.772416|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569678834|64240|1016|
11:30:51.772716|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465276036|64240|0|
11:30:52.411161|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465276036|64240|1115|
11:30:52.412579|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569679850|64240|2040|
11:30:52.412879|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465277151|64240|0|
11:30:52.965371|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465277151|64240|1198|
11:30:52.971252|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569681890|64240|1290|
11:30:52.971552|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465278349|64240|0|
11:30:53.824129|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465278349|64240|1334|
11:30:53.827242|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569683180|64240|1503|
11:30:53.827542|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465279683|64240|0|
11:30:54.983668|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465279683|64240|897|
11:30:54.985612|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569684683|64240|2741|
11:30:54.985912|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465280580|64240|0|
11:30:55.589518|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465280580|64240|908|
11:30:55.593279|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569687424|64240|2669|
11:30:55.593579|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465281488|64240|0|
11:30:56.106994|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465281488|64240|949|
11:30:56.109147|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569690093|64240|2098|
11:30:56.109447|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465282437|64240|0|
11:30:56.683646|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465282437|64240|1169|
11:30:56.684769|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569692191|64240|2406|
11:30:56.685069|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465283606|64240|0|
11:30:58.025377|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465283606|64240|774|
11:30:58.028552|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569694597|64240|1140|
11:30:58.028852|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465284380|64240|0|
11:30:58.727982|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465284380|64240|991|
11:30:58.732323|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569695737|64240|2036|
11:30:58.732623|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465285371|64240|0|
11:30:59.635526|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465285371|64240|1261|
11:30:59.637928|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569697773|64240|1430|
11:30:59.638228|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465286632|64240|0|
11:31:00.489007|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465286632|64240|1351|
11:31:00.493163|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569699203|64240|1755|
11:31:00.493463|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465287983|64240|0|
11:31:01.597281|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465287983|64240|1095|
11:31:01.599960|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569700958|64240|1132|
11:31:01.600260|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465289078|64240|0|
11:31:02.467486|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465289078|64240|753|
11:31:02.472284|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569702090|64240|2160|
11:31:02.472584|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465289831|64240|0|
11:31:02.612536|udp|10.20.6.40|60091|10.20.1.10|53|q|24248|0|63|24248+ A? rmg-backup-01.ridgelinemed.example.
11:31:02.616366|udp|10.20.1.10|53|10.20.6.40|60091|r|24248|0|79|24248 1/0/0 A 10.20.9.15
11:31:03.461124|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465289831|64240|1247|
11:31:03.466099|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569704250|64240|831|
11:31:03.466399|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465291078|64240|0|
11:31:04.268783|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465291078|64240|1238|
11:31:04.272711|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569705081|64240|2622|
11:31:04.273011|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465292316|64240|0|
11:31:05.620002|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465292316|64240|1049|
11:31:05.625496|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569707703|64240|984|
11:31:05.625796|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465293365|64240|0|
11:31:06.638842|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465293365|64240|1231|
11:31:06.640862|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569708687|64240|1366|
11:31:06.641162|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465294596|64240|0|
11:31:07.000000|tcp|10.20.9.40|48145|10.20.6.40|9100|S|1736799192|65535|0|
11:31:07.000916|tcp|10.20.6.40|9100|10.20.9.40|48145|S.|53285607|65535|0|
11:31:07.001173|tcp|10.20.9.40|48145|10.20.6.40|9100|.|1736799193|65535|0|
11:31:07.022506|tcp|10.20.9.40|48145|10.20.6.40|9100|P.|1736799193|65535|820|GET /metrics HTTP/1.1
11:31:07.023758|tcp|10.20.6.40|9100|10.20.9.40|48145|P.|53285608|65535|1209|
11:31:07.024058|tcp|10.20.9.40|48145|10.20.6.40|9100|.|1736800013|65535|0|
11:31:07.044058|tcp|10.20.9.40|48145|10.20.6.40|9100|F.|1736800013|65535|0|
11:31:07.044558|tcp|10.20.6.40|9100|10.20.9.40|48145|F.|53286817|65535|0|
11:31:07.044758|tcp|10.20.9.40|48145|10.20.6.40|9100|.|1736800014|65535|0|
11:31:07.262652|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465294596|64240|789|
11:31:07.266397|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569710053|64240|773|
11:31:07.266697|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465295385|64240|0|
11:31:08.177191|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465295385|64240|883|
11:31:08.182565|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569710826|64240|2749|
11:31:08.182865|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465296268|64240|0|
11:31:08.736071|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465296268|64240|790|
11:31:08.740141|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569713575|64240|760|
11:31:08.740441|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465297058|64240|0|
11:31:10.090833|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465297058|64240|885|
11:31:10.092067|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569714335|64240|2297|
11:31:10.092367|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465297943|64240|0|
11:31:11.406620|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465297943|64240|1284|
11:31:11.408420|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569716632|64240|2094|
11:31:11.408720|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465299227|64240|0|
11:31:12.055162|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465299227|64240|922|
11:31:12.060264|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569718726|64240|916|
11:31:12.060564|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465300149|64240|0|
11:31:12.614769|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465300149|64240|1087|
11:31:12.616460|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569719642|64240|2466|
11:31:12.616760|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465301236|64240|0|
11:31:13.648001|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465301236|64240|1115|
11:31:13.650477|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569722108|64240|2305|
11:31:13.650777|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465302351|64240|0|
11:31:14.973155|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465302351|64240|1148|
11:31:14.975382|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569724413|64240|1697|
11:31:14.975682|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465303499|64240|0|
11:31:16.066266|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465303499|64240|1170|
11:31:16.070148|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569726110|64240|965|
11:31:16.070448|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465304669|64240|0|
11:31:16.716504|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465304669|64240|1116|
11:31:16.721503|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569727075|64240|2387|
11:31:16.721803|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465305785|64240|0|
11:31:18.073768|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465305785|64240|950|
11:31:18.075771|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569729462|64240|2183|
11:31:18.076071|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465306735|64240|0|
11:31:18.625397|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465306735|64240|920|
11:31:18.630321|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569731645|64240|2008|
11:31:18.630621|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465307655|64240|0|
11:31:19.505112|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465307655|64240|1307|
11:31:19.510343|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569733653|64240|2792|
11:31:19.510643|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465308962|64240|0|
11:31:20.853135|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465308962|64240|731|
11:31:20.854284|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569736445|64240|2453|
11:31:20.854584|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465309693|64240|0|
11:31:22.141331|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465309693|64240|1271|
11:31:22.143540|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569738898|64240|1266|
11:31:22.143840|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465310964|64240|0|
11:31:23.388088|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465310964|64240|1166|
11:31:23.391927|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569740164|64240|2658|
11:31:23.392227|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465312130|64240|0|
11:31:24.192893|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465312130|64240|1189|
11:31:24.196514|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569742822|64240|2437|
11:31:24.196814|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465313319|64240|0|
11:31:25.402672|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465313319|64240|1106|
11:31:25.406263|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569745259|64240|1797|
11:31:25.406563|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465314425|64240|0|
11:31:25.942371|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465314425|64240|1204|
11:31:25.948019|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569747056|64240|1643|
11:31:25.948319|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465315629|64240|0|
11:31:26.891647|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465315629|64240|1073|
11:31:26.892961|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569748699|64240|2745|
11:31:26.893261|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465316702|64240|0|
11:31:27.972555|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465316702|64240|992|
11:31:27.977137|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569751444|64240|2684|
11:31:27.977437|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465317694|64240|0|
11:31:28.476630|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465317694|64240|959|
11:31:28.482483|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569754128|64240|1858|
11:31:28.482783|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465318653|64240|0|
11:31:29.355502|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465318653|64240|714|
11:31:29.359645|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569755986|64240|1521|
11:31:29.359945|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465319367|64240|0|
11:31:30.568380|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465319367|64240|1162|
11:31:30.570022|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569757507|64240|2654|
11:31:30.570322|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465320529|64240|0|
11:31:31.817108|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465320529|64240|1282|
11:31:31.819359|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569760161|64240|2555|
11:31:31.819659|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465321811|64240|0|
11:31:32.631239|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465321811|64240|991|
11:31:32.634621|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569762716|64240|2305|
11:31:32.634921|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465322802|64240|0|
11:31:34.028895|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465322802|64240|1382|
11:31:34.031968|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569765021|64240|2450|
11:31:34.032268|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465324184|64240|0|
11:31:34.588928|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465324184|64240|1268|
11:31:34.594474|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569767471|64240|1249|
11:31:34.594774|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465325452|64240|0|
11:31:35.889523|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465325452|64240|1056|
11:31:35.894376|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569768720|64240|799|
11:31:35.894676|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465326508|64240|0|
11:31:36.609465|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465326508|64240|786|
11:31:36.614772|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569769519|64240|1728|
11:31:36.615072|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465327294|64240|0|
11:31:37.121333|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465327294|64240|782|
11:31:37.126674|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569771247|64240|1257|
11:31:37.126974|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465328076|64240|0|
11:31:37.755400|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465328076|64240|1026|
11:31:37.756428|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569772504|64240|1132|
11:31:37.756728|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465329102|64240|0|
11:31:39.013174|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465329102|64240|979|
11:31:39.014973|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569773636|64240|2054|
11:31:39.015273|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465330081|64240|0|
11:31:40.060000|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465330081|64240|829|
11:31:40.064579|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569775690|64240|1186|
11:31:40.064879|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465330910|64240|0|
11:31:40.666599|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465330910|64240|1180|
11:31:40.667606|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569776876|64240|2421|
11:31:40.667906|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465332090|64240|0|
11:31:41.586757|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465332090|64240|966|
11:31:41.588260|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569779297|64240|2027|
11:31:41.588560|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465333056|64240|0|
11:31:42.222342|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465333056|64240|1075|
11:31:42.228019|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569781324|64240|2600|
11:31:42.228319|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465334131|64240|0|
11:31:42.990302|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465334131|64240|1251|
11:31:42.991923|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569783924|64240|2620|
11:31:42.992223|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465335382|64240|0|
11:31:43.625888|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465335382|64240|982|
11:31:43.629252|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569786544|64240|1175|
11:31:43.629552|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465336364|64240|0|
11:31:44.934646|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465336364|64240|1109|
11:31:44.936408|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569787719|64240|2085|
11:31:44.936708|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465337473|64240|0|
11:31:45.849425|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465337473|64240|887|
11:31:45.853661|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569789804|64240|2783|
11:31:45.853961|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465338360|64240|0|
11:31:46.840066|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465338360|64240|701|
11:31:46.842575|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569792587|64240|2238|
11:31:46.842875|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465339061|64240|0|
11:31:48.176808|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465339061|64240|928|
11:31:48.178950|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569794825|64240|2799|
11:31:48.179250|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465339989|64240|0|
11:31:48.870423|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465339989|64240|1167|
11:31:48.872739|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569797624|64240|1509|
11:31:48.873039|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465341156|64240|0|
11:31:49.443298|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465341156|64240|930|
11:31:49.446910|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569799133|64240|2537|
11:31:49.447210|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465342086|64240|0|
11:31:50.678766|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465342086|64240|1282|
11:31:50.683390|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569801670|64240|783|
11:31:50.683690|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465343368|64240|0|
11:31:51.500925|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465343368|64240|1109|
11:31:51.503883|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569802453|64240|2694|
11:31:51.504183|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465344477|64240|0|
11:31:52.071274|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465344477|64240|1179|
11:31:52.072650|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569805147|64240|2708|
11:31:52.072950|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465345656|64240|0|
11:31:52.877920|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465345656|64240|978|
11:31:52.880945|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569807855|64240|1848|
11:31:52.881245|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465346634|64240|0|
11:31:53.526467|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465346634|64240|1246|
11:31:53.528019|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569809703|64240|2170|
11:31:53.528319|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465347880|64240|0|
11:31:54.794404|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465347880|64240|750|
11:31:54.795599|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569811873|64240|1956|
11:31:54.795899|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465348630|64240|0|
11:31:56.073135|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465348630|64240|788|
11:31:56.075331|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569813829|64240|1852|
11:31:56.075631|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465349418|64240|0|
11:31:57.023394|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465349418|64240|815|
11:31:57.027156|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569815681|64240|1866|
11:31:57.027456|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465350233|64240|0|
11:31:58.187570|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465350233|64240|1166|
11:31:58.188874|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569817547|64240|1158|
11:31:58.189174|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465351399|64240|0|
11:31:59.062622|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465351399|64240|1025|
11:31:59.067238|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569818705|64240|2390|
11:31:59.067538|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465352424|64240|0|
11:31:59.886069|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465352424|64240|799|
11:31:59.890975|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569821095|64240|904|
11:31:59.891275|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465353223|64240|0|
11:32:00.472373|tcp|10.20.4.31|54980|10.20.6.40|443|S|2347928072|64240|0|
11:32:00.472972|tcp|10.20.6.40|443|10.20.4.31|54980|S.|3664911862|65535|0|
11:32:00.473597|tcp|10.20.4.31|54980|10.20.6.40|443|.|2347928073|64240|0|
11:32:00.489860|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465353223|64240|1347|
11:32:00.491724|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569821999|64240|813|
11:32:00.492024|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465354570|64240|0|
11:32:00.505077|tcp|10.20.4.31|54980|10.20.6.40|443|P.|2347928073|64240|943|TLS SNI: portal.ridgelinemed.example
11:32:00.506667|tcp|10.20.6.40|443|10.20.4.31|54980|P.|3664911863|65535|2313|
11:32:00.506967|tcp|10.20.4.31|54980|10.20.6.40|443|.|2347929016|64240|0|
11:32:00.566541|tcp|10.20.4.31|54980|10.20.6.40|443|P.|2347929016|64240|906|
11:32:00.570718|tcp|10.20.6.40|443|10.20.4.31|54980|P.|3664914176|65535|2589|
11:32:00.571018|tcp|10.20.4.31|54980|10.20.6.40|443|.|2347929922|64240|0|
11:32:00.594208|tcp|10.20.4.31|54980|10.20.6.40|443|P.|2347929922|64240|983|
11:32:00.595533|tcp|10.20.6.40|443|10.20.4.31|54980|P.|3664916765|65535|2234|
11:32:00.595833|tcp|10.20.4.31|54980|10.20.6.40|443|.|2347930905|64240|0|
11:32:00.617411|tcp|10.20.4.31|54980|10.20.6.40|443|P.|2347930905|64240|1236|
11:32:00.623345|tcp|10.20.6.40|443|10.20.4.31|54980|P.|3664918999|65535|2309|
11:32:00.623645|tcp|10.20.4.31|54980|10.20.6.40|443|.|2347932141|64240|0|
11:32:00.643645|tcp|10.20.4.31|54980|10.20.6.40|443|F.|2347932141|64240|0|
11:32:00.644145|tcp|10.20.6.40|443|10.20.4.31|54980|F.|3664921308|65535|0|
11:32:00.644345|tcp|10.20.4.31|54980|10.20.6.40|443|.|2347932142|64240|0|
11:32:01.048716|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465354570|64240|855|
11:32:01.054161|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569822812|64240|2578|
11:32:01.054461|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465355425|64240|0|
11:32:01.667920|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465355425|64240|713|
11:32:01.670170|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569825390|64240|791|
11:32:01.670470|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465356138|64240|0|
11:32:02.452892|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465356138|64240|771|
11:32:02.454559|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569826181|64240|1099|
11:32:02.454859|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465356909|64240|0|
11:32:02.606493|udp|10.20.6.40|50777|10.20.1.10|53|q|5976|0|63|5976+ A? rmg-backup-01.ridgelinemed.example.
11:32:02.608573|udp|10.20.1.10|53|10.20.6.40|50777|r|5976|0|79|5976 1/0/0 A 10.20.9.15
11:32:02.933970|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465356909|64240|1209|
11:32:02.937766|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569827280|64240|2268|
11:32:02.938066|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465358118|64240|0|
11:32:03.456949|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465358118|64240|728|
11:32:03.462446|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569829548|64240|2413|
11:32:03.462746|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465358846|64240|0|
11:32:04.287060|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465358846|64240|783|
11:32:04.291022|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569831961|64240|1648|
11:32:04.291322|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465359629|64240|0|
11:32:05.198458|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465359629|64240|856|
11:32:05.200252|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569833609|64240|1847|
11:32:05.200552|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465360485|64240|0|
11:32:06.223536|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465360485|64240|1081|
11:32:06.229141|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569835456|64240|1517|
11:32:06.229441|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465361566|64240|0|
11:32:06.916823|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465361566|64240|929|
11:32:06.922535|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569836973|64240|1070|
11:32:06.922835|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465362495|64240|0|
11:32:07.000000|tcp|10.20.9.40|40975|10.20.6.40|9100|S|468005078|62720|0|
11:32:07.001108|tcp|10.20.6.40|9100|10.20.9.40|40975|S.|2673720104|65535|0|
11:32:07.002011|tcp|10.20.9.40|40975|10.20.6.40|9100|.|468005079|62720|0|
11:32:07.031210|tcp|10.20.9.40|40975|10.20.6.40|9100|P.|468005079|62720|544|GET /metrics HTTP/1.1
11:32:07.033326|tcp|10.20.6.40|9100|10.20.9.40|40975|P.|2673720105|65535|1377|
11:32:07.033626|tcp|10.20.9.40|40975|10.20.6.40|9100|.|468005623|62720|0|
11:32:07.053626|tcp|10.20.9.40|40975|10.20.6.40|9100|F.|468005623|62720|0|
11:32:07.054126|tcp|10.20.6.40|9100|10.20.9.40|40975|F.|2673721482|65535|0|
11:32:07.054326|tcp|10.20.9.40|40975|10.20.6.40|9100|.|468005624|62720|0|
11:32:07.533722|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465362495|64240|1050|
11:32:07.537940|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569838043|64240|2286|
11:32:07.538240|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465363545|64240|0|
11:32:08.542584|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465363545|64240|809|
11:32:08.546553|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569840329|64240|1712|
11:32:08.546853|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465364354|64240|0|
11:32:09.822854|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465364354|64240|1340|
11:32:09.826529|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569842041|64240|1165|
11:32:09.826829|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465365694|64240|0|
11:32:10.337524|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465365694|64240|829|
11:32:10.342676|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569843206|64240|2123|
11:32:10.342976|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465366523|64240|0|
11:32:10.958432|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465366523|64240|972|
11:32:10.961179|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569845329|64240|1324|
11:32:10.961479|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465367495|64240|0|
11:32:11.603348|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465367495|64240|1240|
11:32:11.606239|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569846653|64240|2424|
11:32:11.606539|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465368735|64240|0|
11:32:12.895843|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465368735|64240|871|
11:32:12.900205|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569849077|64240|1844|
11:32:12.900505|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465369606|64240|0|
11:32:13.790422|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465369606|64240|1152|
11:32:13.791902|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569850921|64240|2162|
11:32:13.792202|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465370758|64240|0|
11:32:14.852945|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465370758|64240|1324|
11:32:14.856114|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569853083|64240|1793|
11:32:14.856414|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465372082|64240|0|
11:32:15.733511|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465372082|64240|1170|
11:32:15.735089|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569854876|64240|2690|
11:32:15.735389|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465373252|64240|0|
11:32:16.440992|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465373252|64240|883|
11:32:16.446514|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569857566|64240|2315|
11:32:16.446814|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465374135|64240|0|
11:32:17.232282|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465374135|64240|1350|
11:32:17.236367|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569859881|64240|2121|
11:32:17.236667|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465375485|64240|0|
11:32:18.602392|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465375485|64240|1133|
11:32:18.603454|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569862002|64240|875|
11:32:18.603754|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465376618|64240|0|
11:32:19.797527|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465376618|64240|1043|
11:32:19.802724|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569862877|64240|2257|
11:32:19.803024|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465377661|64240|0|
11:32:20.320281|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465377661|64240|892|
11:32:20.322996|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569865134|64240|919|
11:32:20.323296|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465378553|64240|0|
11:32:21.018060|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465378553|64240|1225|
11:32:21.020393|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569866053|64240|2211|
11:32:21.020693|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465379778|64240|0|
11:32:21.566633|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465379778|64240|1146|
11:32:21.571040|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569868264|64240|1715|
11:32:21.571340|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465380924|64240|0|
11:32:22.840840|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465380924|64240|1020|
11:32:22.845816|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569869979|64240|1116|
11:32:22.846116|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465381944|64240|0|
11:32:23.341767|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465381944|64240|1179|
11:32:23.345795|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569871095|64240|1519|
11:32:23.346095|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465383123|64240|0|
11:32:24.046919|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465383123|64240|1254|
11:32:24.051701|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569872614|64240|2075|
11:32:24.052001|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465384377|64240|0|
11:32:25.099711|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465384377|64240|828|
11:32:25.103539|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569874689|64240|714|
11:32:25.103839|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465385205|64240|0|
11:32:26.101660|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465385205|64240|1158|
11:32:26.105730|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569875403|64240|2027|
11:32:26.106030|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465386363|64240|0|
11:32:26.852287|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465386363|64240|1171|
11:32:26.853696|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569877430|64240|1125|
11:32:26.853996|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465387534|64240|0|
11:32:28.206088|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465387534|64240|1150|
11:32:28.209615|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569878555|64240|943|
11:32:28.209915|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465388684|64240|0|
11:32:29.096315|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465388684|64240|866|
11:32:29.098010|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569879498|64240|1975|
11:32:29.098310|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465389550|64240|0|
11:32:29.681893|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465389550|64240|866|
11:32:29.686591|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569881473|64240|1829|
11:32:29.686891|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465390416|64240|0|
11:32:30.184840|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465390416|64240|915|
11:32:30.186638|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569883302|64240|776|
11:32:30.186938|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465391331|64240|0|
11:32:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 47
11:32:31.000525|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 47
11:32:31.224949|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465391331|64240|788|
11:32:31.228221|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569884078|64240|854|
11:32:31.228521|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465392119|64240|0|
11:32:32.252956|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465392119|64240|953|
11:32:32.258897|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569884932|64240|944|
11:32:32.259197|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465393072|64240|0|
11:32:33.187339|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465393072|64240|759|
11:32:33.190287|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569885876|64240|2717|
11:32:33.190587|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465393831|64240|0|
11:32:33.730315|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465393831|64240|1208|
11:32:33.734333|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569888593|64240|2326|
11:32:33.734633|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465395039|64240|0|
11:32:34.446232|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465395039|64240|1087|
11:32:34.449165|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569890919|64240|964|
11:32:34.449465|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465396126|64240|0|
11:32:35.127392|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465396126|64240|1392|
11:32:35.131479|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569891883|64240|2792|
11:32:35.131779|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465397518|64240|0|
11:32:36.070636|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465397518|64240|859|
11:32:36.072202|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569894675|64240|1091|
11:32:36.072502|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465398377|64240|0|
11:32:37.118884|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465398377|64240|932|
11:32:37.120617|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569895766|64240|779|
11:32:37.120917|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465399309|64240|0|
11:32:37.944408|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465399309|64240|977|
11:32:37.949501|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569896545|64240|1250|
11:32:37.949801|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465400286|64240|0|
11:32:38.569074|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465400286|64240|920|
11:32:38.575013|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569897795|64240|1178|
11:32:38.575313|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465401206|64240|0|
11:32:39.580893|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465401206|64240|761|
11:32:39.582224|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569898973|64240|740|
11:32:39.582524|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465401967|64240|0|
11:32:40.210611|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465401967|64240|1284|
11:32:40.216589|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569899713|64240|2633|
11:32:40.216889|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465403251|64240|0|
11:32:40.717232|udp|10.20.6.40|54025|10.20.1.10|53|q|44770|0|56|44770+ A? portal.ridgelinemed.example.
11:32:40.719525|udp|10.20.1.10|53|10.20.6.40|54025|r|44770|0|72|44770 1/0/0 A 10.20.6.40
11:32:41.516253|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465403251|64240|1296|
11:32:41.521750|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569902346|64240|1978|
11:32:41.522050|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465404547|64240|0|
11:32:41.999420|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465404547|64240|1239|
11:32:42.002628|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569904324|64240|705|
11:32:42.002928|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465405786|64240|0|
11:32:43.117500|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465405786|64240|1250|
11:32:43.119150|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569905029|64240|1610|
11:32:43.119450|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465407036|64240|0|
11:32:44.205242|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465407036|64240|867|
11:32:44.209980|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569906639|64240|860|
11:32:44.210280|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465407903|64240|0|
11:32:45.413889|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465407903|64240|1000|
11:32:45.416875|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569907499|64240|1447|
11:32:45.417175|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465408903|64240|0|
11:32:46.781386|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465408903|64240|1149|
11:32:46.784979|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569908946|64240|795|
11:32:46.785279|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465410052|64240|0|
11:32:47.760890|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465410052|64240|1102|
11:32:47.765421|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569909741|64240|2113|
11:32:47.765721|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465411154|64240|0|
11:32:48.465256|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465411154|64240|976|
11:32:48.470332|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569911854|64240|1656|
11:32:48.470632|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465412130|64240|0|
11:32:49.796041|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465412130|64240|1112|
11:32:49.797750|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569913510|64240|1942|
11:32:49.798050|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465413242|64240|0|
11:32:50.449258|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465413242|64240|1299|
11:32:50.452927|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569915452|64240|2131|
11:32:50.453227|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465414541|64240|0|
11:32:51.173864|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465414541|64240|935|
11:32:51.175882|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569917583|64240|2085|
11:32:51.176182|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465415476|64240|0|
11:32:51.824509|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465415476|64240|1242|
11:32:51.828442|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569919668|64240|1570|
11:32:51.828742|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465416718|64240|0|
11:32:52.673433|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465416718|64240|1201|
11:32:52.674658|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569921238|64240|2368|
11:32:52.674958|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465417919|64240|0|
11:32:53.420426|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465417919|64240|826|
11:32:53.425820|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569923606|64240|1697|
11:32:53.426120|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465418745|64240|0|
11:32:54.094003|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465418745|64240|1249|
11:32:54.097111|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569925303|64240|909|
11:32:54.097411|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465419994|64240|0|
11:32:55.239428|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465419994|64240|1092|
11:32:55.243095|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569926212|64240|1719|
11:32:55.243395|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465421086|64240|0|
11:32:56.065362|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465421086|64240|921|
11:32:56.069999|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569927931|64240|2053|
11:32:56.070299|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465422007|64240|0|
11:32:57.273004|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465422007|64240|1146|
11:32:57.278053|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569929984|64240|1594|
11:32:57.278353|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465423153|64240|0|
11:32:58.622732|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465423153|64240|828|
11:32:58.628281|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569931578|64240|971|
11:32:58.628581|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465423981|64240|0|
11:32:59.467612|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465423981|64240|1172|
11:32:59.472297|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569932549|64240|2620|
11:32:59.472597|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465425153|64240|0|
11:33:00.233047|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465425153|64240|927|
11:33:00.234585|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569935169|64240|2170|
11:33:00.234885|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465426080|64240|0|
11:33:01.024902|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465426080|64240|1395|
11:33:01.030209|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569937339|64240|2563|
11:33:01.030509|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465427475|64240|0|
11:33:01.989665|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465427475|64240|1171|
11:33:01.993826|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569939902|64240|1401|
11:33:01.994126|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465428646|64240|0|
11:33:02.922161|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465428646|64240|1013|
11:33:02.924906|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569941303|64240|2449|
11:33:02.925206|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465429659|64240|0|
11:33:04.145051|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465429659|64240|812|
11:33:04.146670|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569943752|64240|1402|
11:33:04.146970|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465430471|64240|0|
11:33:05.410773|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465430471|64240|767|
11:33:05.414429|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569945154|64240|1661|
11:33:05.414729|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465431238|64240|0|
11:33:06.268270|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465431238|64240|726|
11:33:06.273601|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569946815|64240|2204|
11:33:06.273901|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465431964|64240|0|
11:33:07.000000|tcp|10.20.9.40|39633|10.20.6.40|9100|S|3694355437|64240|0|
11:33:07.000815|tcp|10.20.6.40|9100|10.20.9.40|39633|S.|2149591661|65535|0|
11:33:07.001322|tcp|10.20.9.40|39633|10.20.6.40|9100|.|3694355438|64240|0|
11:33:07.019399|tcp|10.20.9.40|39633|10.20.6.40|9100|P.|3694355438|64240|778|GET /metrics HTTP/1.1
11:33:07.022810|tcp|10.20.6.40|9100|10.20.9.40|39633|P.|2149591662|65535|597|
11:33:07.023110|tcp|10.20.9.40|39633|10.20.6.40|9100|.|3694356216|64240|0|
11:33:07.043110|tcp|10.20.9.40|39633|10.20.6.40|9100|F.|3694356216|64240|0|
11:33:07.043610|tcp|10.20.6.40|9100|10.20.9.40|39633|F.|2149592259|65535|0|
11:33:07.043810|tcp|10.20.9.40|39633|10.20.6.40|9100|.|3694356217|64240|0|
11:33:07.127290|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465431964|64240|934|
11:33:07.132555|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569949019|64240|1614|
11:33:07.132855|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465432898|64240|0|
11:33:08.514762|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465432898|64240|1393|
11:33:08.518138|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569950633|64240|732|
11:33:08.518438|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465434291|64240|0|
11:33:09.244383|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465434291|64240|1181|
11:33:09.248536|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569951365|64240|890|
11:33:09.248836|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465435472|64240|0|
11:33:10.627606|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465435472|64240|1311|
11:33:10.631106|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569952255|64240|816|
11:33:10.631406|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465436783|64240|0|
11:33:11.438463|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465436783|64240|1377|
11:33:11.444252|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569953071|64240|1550|
11:33:11.444552|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465438160|64240|0|
11:33:12.607371|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465438160|64240|912|
11:33:12.611789|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569954621|64240|2120|
11:33:12.612089|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465439072|64240|0|
11:33:13.414127|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465439072|64240|720|
11:33:13.417167|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569956741|64240|2192|
11:33:13.417467|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465439792|64240|0|
11:33:14.673464|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465439792|64240|1345|
11:33:14.677359|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569958933|64240|1936|
11:33:14.677659|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465441137|64240|0|
11:33:15.935649|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465441137|64240|1168|
11:33:15.937861|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569960869|64240|970|
11:33:15.938161|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465442305|64240|0|
11:33:17.149411|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465442305|64240|751|
11:33:17.152982|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569961839|64240|1778|
11:33:17.153282|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465443056|64240|0|
11:33:17.866317|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465443056|64240|798|
11:33:17.867697|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569963617|64240|754|
11:33:17.867997|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465443854|64240|0|
11:33:19.072056|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465443854|64240|1303|
11:33:19.076041|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569964371|64240|1516|
11:33:19.076341|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465445157|64240|0|
11:33:20.328994|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465445157|64240|900|
11:33:20.330473|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569965887|64240|1801|
11:33:20.330773|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465446057|64240|0|
11:33:21.272743|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465446057|64240|1079|
11:33:21.274402|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569967688|64240|749|
11:33:21.274702|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465447136|64240|0|
11:33:22.137715|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465447136|64240|866|
11:33:22.140558|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569968437|64240|1246|
11:33:22.140858|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465448002|64240|0|
11:33:23.100119|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465448002|64240|1089|
11:33:23.103006|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569969683|64240|1129|
11:33:23.103306|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465449091|64240|0|
11:33:23.710283|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465449091|64240|1189|
11:33:23.713765|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569970812|64240|847|
11:33:23.714065|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465450280|64240|0|
11:33:24.338771|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465450280|64240|1030|
11:33:24.344734|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569971659|64240|1215|
11:33:24.345034|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465451310|64240|0|
11:33:25.043236|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465451310|64240|784|
11:33:25.047521|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569972874|64240|2500|
11:33:25.047821|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465452094|64240|0|
11:33:25.885429|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465452094|64240|927|
11:33:25.889114|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569975374|64240|2159|
11:33:25.889414|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465453021|64240|0|
11:33:26.774919|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465453021|64240|855|
11:33:26.779556|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569977533|64240|1944|
11:33:26.779856|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465453876|64240|0|
11:33:27.747056|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465453876|64240|1354|
11:33:27.750794|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569979477|64240|1367|
11:33:27.751094|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465455230|64240|0|
11:33:28.997282|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465455230|64240|844|
11:33:29.001713|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569980844|64240|2347|
11:33:29.002013|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465456074|64240|0|
11:33:30.307377|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465456074|64240|1092|
11:33:30.312866|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569983191|64240|1929|
11:33:30.313166|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465457166|64240|0|
11:33:30.960614|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465457166|64240|1318|
11:33:30.963568|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569985120|64240|2209|
11:33:30.963868|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465458484|64240|0|
11:33:31.884220|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465458484|64240|980|
11:33:31.889713|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569987329|64240|1188|
11:33:31.890013|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465459464|64240|0|
11:33:32.965437|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465459464|64240|930|
11:33:32.968013|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569988517|64240|1935|
11:33:32.968313|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465460394|64240|0|
11:33:33.966579|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465460394|64240|1201|
11:33:33.970024|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569990452|64240|2005|
11:33:33.970324|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465461595|64240|0|
11:33:35.011520|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465461595|64240|1323|
11:33:35.015700|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569992457|64240|2464|
11:33:35.016000|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465462918|64240|0|
11:33:35.750206|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465462918|64240|975|
11:33:35.755903|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569994921|64240|1819|
11:33:35.756203|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465463893|64240|0|
11:33:37.138947|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465463893|64240|1056|
11:33:37.142234|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569996740|64240|1409|
11:33:37.142534|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465464949|64240|0|
11:33:37.642915|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465464949|64240|981|
11:33:37.645860|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569998149|64240|1725|
11:33:37.646160|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465465930|64240|0|
11:33:38.521157|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465465930|64240|974|
11:33:38.523873|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1569999874|64240|2150|
11:33:38.524173|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465466904|64240|0|
11:33:39.568392|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465466904|64240|1239|
11:33:39.570282|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570002024|64240|2553|
11:33:39.570582|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465468143|64240|0|
11:33:40.721269|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465468143|64240|1157|
11:33:40.724815|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570004577|64240|1873|
11:33:40.725115|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465469300|64240|0|
11:33:41.243962|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465469300|64240|1333|
11:33:41.248026|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570006450|64240|797|
11:33:41.248326|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465470633|64240|0|
11:33:42.022379|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465470633|64240|821|
11:33:42.024477|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570007247|64240|2497|
11:33:42.024777|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465471454|64240|0|
11:33:42.156084|udp|10.20.6.40|58994|10.20.1.10|53|q|12856|0|39|12856+ A? ubuntu.com.
11:33:42.159819|udp|10.20.1.10|53|10.20.6.40|58994|r|12856|0|55|12856 1/0/0 A 192.0.2.30
11:33:42.749699|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465471454|64240|1151|
11:33:42.755013|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570009744|64240|1727|
11:33:42.755313|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465472605|64240|0|
11:33:43.388055|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465472605|64240|1156|
11:33:43.389488|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570011471|64240|857|
11:33:43.389788|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465473761|64240|0|
11:33:43.970674|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465473761|64240|746|
11:33:43.973980|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570012328|64240|1475|
11:33:43.974280|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465474507|64240|0|
11:33:45.274956|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465474507|64240|704|
11:33:45.280811|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570013803|64240|2604|
11:33:45.281111|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465475211|64240|0|
11:33:46.630032|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465475211|64240|1303|
11:33:46.634400|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570016407|64240|2218|
11:33:46.634700|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465476514|64240|0|
11:33:47.815968|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465476514|64240|719|
11:33:47.820058|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570018625|64240|1402|
11:33:47.820358|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465477233|64240|0|
11:33:48.978252|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465477233|64240|728|
11:33:48.982664|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570020027|64240|2545|
11:33:48.982964|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465477961|64240|0|
11:33:50.365069|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465477961|64240|1396|
11:33:50.368557|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570022572|64240|969|
11:33:50.368857|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465479357|64240|0|
11:33:51.101832|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465479357|64240|709|
11:33:51.104151|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570023541|64240|2689|
11:33:51.104451|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465480066|64240|0|
11:33:52.017733|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465480066|64240|1023|
11:33:52.021499|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570026230|64240|895|
11:33:52.021799|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465481089|64240|0|
11:33:52.627899|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465481089|64240|1174|
11:33:52.631239|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570027125|64240|1702|
11:33:52.631539|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465482263|64240|0|
11:33:53.756872|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465482263|64240|746|
11:33:53.761400|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570028827|64240|1891|
11:33:53.761700|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465483009|64240|0|
11:33:54.670103|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465483009|64240|1059|
11:33:54.672781|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570030718|64240|797|
11:33:54.673081|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465484068|64240|0|
11:33:55.396042|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465484068|64240|1241|
11:33:55.397759|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570031515|64240|1704|
11:33:55.398059|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465485309|64240|0|
11:33:56.190537|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465485309|64240|790|
11:33:56.193392|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570033219|64240|1352|
11:33:56.193692|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465486099|64240|0|
11:33:56.690557|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465486099|64240|1199|
11:33:56.695116|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570034571|64240|1294|
11:33:56.695416|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465487298|64240|0|
11:33:57.386502|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465487298|64240|789|
11:33:57.390655|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570035865|64240|2566|
11:33:57.390955|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465488087|64240|0|
11:33:57.904873|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465488087|64240|992|
11:33:57.909760|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570038431|64240|1544|
11:33:57.910060|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465489079|64240|0|
11:33:58.498276|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465489079|64240|1162|
11:33:58.499381|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570039975|64240|914|
11:33:58.499681|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465490241|64240|0|
11:33:59.330051|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465490241|64240|831|
11:33:59.334840|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570040889|64240|2333|
11:33:59.335140|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465491072|64240|0|
11:33:59.856150|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465491072|64240|1133|
11:33:59.860898|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570043222|64240|1525|
11:33:59.861198|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465492205|64240|0|
11:34:00.545491|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465492205|64240|1360|
11:34:00.546553|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570044747|64240|951|
11:34:00.546853|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465493565|64240|0|
11:34:01.099504|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465493565|64240|1131|
11:34:01.103985|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570045698|64240|2240|
11:34:01.104285|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465494696|64240|0|
11:34:01.949750|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465494696|64240|1211|
11:34:01.951281|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570047938|64240|1213|
11:34:01.951581|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465495907|64240|0|
11:34:03.200362|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465495907|64240|1242|
11:34:03.203573|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570049151|64240|1440|
11:34:03.203873|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465497149|64240|0|
11:34:04.006096|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465497149|64240|1152|
11:34:04.011039|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570050591|64240|700|
11:34:04.011339|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465498301|64240|0|
11:34:04.783913|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465498301|64240|706|
11:34:04.786314|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570051291|64240|1153|
11:34:04.786614|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465499007|64240|0|
11:34:05.879499|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465499007|64240|1206|
11:34:05.883151|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570052444|64240|1849|
11:34:05.883451|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465500213|64240|0|
11:34:06.893018|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465500213|64240|1297|
11:34:06.894576|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570054293|64240|2268|
11:34:06.894876|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465501510|64240|0|
11:34:07.000000|tcp|10.20.9.40|59208|10.20.6.40|9100|S|1730255232|64240|0|
11:34:07.000631|tcp|10.20.6.40|9100|10.20.9.40|59208|S.|3870221119|29200|0|
11:34:07.001513|tcp|10.20.9.40|59208|10.20.6.40|9100|.|1730255233|64240|0|
11:34:07.045531|tcp|10.20.9.40|59208|10.20.6.40|9100|P.|1730255233|64240|878|GET /metrics HTTP/1.1
11:34:07.049074|tcp|10.20.6.40|9100|10.20.9.40|59208|P.|3870221120|29200|783|
11:34:07.049374|tcp|10.20.9.40|59208|10.20.6.40|9100|.|1730256111|64240|0|
11:34:07.069374|tcp|10.20.9.40|59208|10.20.6.40|9100|F.|1730256111|64240|0|
11:34:07.069874|tcp|10.20.6.40|9100|10.20.9.40|59208|F.|3870221903|29200|0|
11:34:07.070074|tcp|10.20.9.40|59208|10.20.6.40|9100|.|1730256112|64240|0|
11:34:07.495485|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465501510|64240|1315|
11:34:07.498495|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570056561|64240|1250|
11:34:07.498795|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465502825|64240|0|
11:34:08.809304|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465502825|64240|726|
11:34:08.811451|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570057811|64240|969|
11:34:08.811751|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465503551|64240|0|
11:34:09.877288|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465503551|64240|1357|
11:34:09.878983|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570058780|64240|884|
11:34:09.879283|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465504908|64240|0|
11:34:10.989795|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465504908|64240|956|
11:34:10.990914|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570059664|64240|1427|
11:34:10.991214|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465505864|64240|0|
11:34:11.685050|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465505864|64240|1307|
11:34:11.686453|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570061091|64240|2782|
11:34:11.686753|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465507171|64240|0|
11:34:12.243454|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465507171|64240|1050|
11:34:12.246086|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570063873|64240|979|
11:34:12.246386|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465508221|64240|0|
11:34:12.787166|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465508221|64240|1384|
11:34:12.791980|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570064852|64240|2756|
11:34:12.792280|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465509605|64240|0|
11:34:13.876849|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465509605|64240|1062|
11:34:13.879107|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570067608|64240|1940|
11:34:13.879407|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465510667|64240|0|
11:34:15.143958|tcp|10.20.6.40|48674|198.51.100.60|443|P.|2465510667|64240|1316|
11:34:15.146761|tcp|198.51.100.60|443|10.20.6.40|48674|P.|1570069548|64240|1194|
11:34:15.147061|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465511983|64240|0|
11:34:15.167061|tcp|10.20.6.40|48674|198.51.100.60|443|F.|2465511983|64240|0|
11:34:15.167561|tcp|198.51.100.60|443|10.20.6.40|48674|F.|1570070742|64240|0|
11:34:15.167761|tcp|10.20.6.40|48674|198.51.100.60|443|.|2465511984|64240|0|
11:34:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 48
11:34:31.000768|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 48
11:34:35.155780|udp|10.20.6.40|53741|10.20.1.10|53|q|23351|0|64|23351+ A? rmg-monitor-01.ridgelinemed.example.
11:34:35.158880|udp|10.20.1.10|53|10.20.6.40|53741|r|23351|0|80|23351 1/0/0 A 10.20.9.40
11:35:07.000000|tcp|10.20.9.40|56737|10.20.6.40|9100|S|3958912942|64240|0|
11:35:07.001000|tcp|10.20.6.40|9100|10.20.9.40|56737|S.|880781114|62720|0|
11:35:07.001609|tcp|10.20.9.40|56737|10.20.6.40|9100|.|3958912943|64240|0|
11:35:07.032681|tcp|10.20.9.40|56737|10.20.6.40|9100|P.|3958912943|64240|535|GET /metrics HTTP/1.1
11:35:07.037436|tcp|10.20.6.40|9100|10.20.9.40|56737|P.|880781115|62720|824|
11:35:07.037736|tcp|10.20.9.40|56737|10.20.6.40|9100|.|3958913478|64240|0|
11:35:07.057736|tcp|10.20.9.40|56737|10.20.6.40|9100|F.|3958913478|64240|0|
11:35:07.058236|tcp|10.20.6.40|9100|10.20.9.40|56737|F.|880781939|62720|0|
11:35:07.058436|tcp|10.20.9.40|56737|10.20.6.40|9100|.|3958913479|64240|0|
11:35:14.837485|tcp|10.20.4.58|56637|10.20.6.40|443|S|2749983053|29200|0|
11:35:14.838354|tcp|10.20.6.40|443|10.20.4.58|56637|S.|1393160101|65535|0|
11:35:14.838698|tcp|10.20.4.58|56637|10.20.6.40|443|.|2749983054|29200|0|
11:35:14.875761|tcp|10.20.4.58|56637|10.20.6.40|443|P.|2749983054|29200|1266|TLS SNI: portal.ridgelinemed.example
11:35:14.879341|tcp|10.20.6.40|443|10.20.4.58|56637|P.|1393160102|65535|2273|
11:35:14.879641|tcp|10.20.4.58|56637|10.20.6.40|443|.|2749984320|29200|0|
11:35:14.915570|tcp|10.20.4.58|56637|10.20.6.40|443|P.|2749984320|29200|1368|
11:35:14.918807|tcp|10.20.6.40|443|10.20.4.58|56637|P.|1393162375|65535|957|
11:35:14.919107|tcp|10.20.4.58|56637|10.20.6.40|443|.|2749985688|29200|0|
11:35:14.942419|tcp|10.20.4.58|56637|10.20.6.40|443|P.|2749985688|29200|1258|
11:35:14.943682|tcp|10.20.6.40|443|10.20.4.58|56637|P.|1393163332|65535|1840|
11:35:14.943982|tcp|10.20.4.58|56637|10.20.6.40|443|.|2749986946|29200|0|
11:35:14.965599|tcp|10.20.4.58|56637|10.20.6.40|443|P.|2749986946|29200|846|
11:35:14.969272|tcp|10.20.6.40|443|10.20.4.58|56637|P.|1393165172|65535|1732|
11:35:14.969572|tcp|10.20.4.58|56637|10.20.6.40|443|.|2749987792|29200|0|
11:35:14.989405|tcp|10.20.4.58|56637|10.20.6.40|443|P.|2749987792|29200|885|
11:35:14.994471|tcp|10.20.6.40|443|10.20.4.58|56637|P.|1393166904|65535|1756|
11:35:14.994771|tcp|10.20.4.58|56637|10.20.6.40|443|.|2749988677|29200|0|
11:35:15.024156|tcp|10.20.4.58|56637|10.20.6.40|443|P.|2749988677|29200|1379|
11:35:15.027327|tcp|10.20.6.40|443|10.20.4.58|56637|P.|1393168660|65535|2686|
11:35:15.027627|tcp|10.20.4.58|56637|10.20.6.40|443|.|2749990056|29200|0|
11:35:15.060233|tcp|10.20.4.58|56637|10.20.6.40|443|P.|2749990056|29200|1381|
11:35:15.066002|tcp|10.20.6.40|443|10.20.4.58|56637|P.|1393171346|65535|1962|
11:35:15.066302|tcp|10.20.4.58|56637|10.20.6.40|443|.|2749991437|29200|0|
11:35:15.098973|tcp|10.20.4.58|56637|10.20.6.40|443|P.|2749991437|29200|1114|
11:35:15.102400|tcp|10.20.6.40|443|10.20.4.58|56637|P.|1393173308|65535|1856|
11:35:15.102700|tcp|10.20.4.58|56637|10.20.6.40|443|.|2749992551|29200|0|
11:35:15.122700|tcp|10.20.4.58|56637|10.20.6.40|443|F.|2749992551|29200|0|
11:35:15.123200|tcp|10.20.6.40|443|10.20.4.58|56637|F.|1393175164|65535|0|
11:35:15.123400|tcp|10.20.4.58|56637|10.20.6.40|443|.|2749992552|29200|0|
11:35:23.141981|udp|10.20.6.40|60081|10.20.1.10|53|q|19670|0|63|19670+ A? rmg-backup-01.ridgelinemed.example.
11:35:23.144357|udp|10.20.1.10|53|10.20.6.40|60081|r|19670|0|79|19670 1/0/0 A 10.20.9.15
11:35:26.752701|tcp|10.20.4.12|58802|10.20.6.40|443|S|406499101|62720|0|
11:35:26.753961|tcp|10.20.6.40|443|10.20.4.12|58802|S.|146422931|29200|0|
11:35:26.754722|tcp|10.20.4.12|58802|10.20.6.40|443|.|406499102|62720|0|
11:35:26.792524|tcp|10.20.4.12|58802|10.20.6.40|443|P.|406499102|62720|1382|TLS SNI: portal.ridgelinemed.example
11:35:26.795582|tcp|10.20.6.40|443|10.20.4.12|58802|P.|146422932|29200|1444|
11:35:26.795882|tcp|10.20.4.12|58802|10.20.6.40|443|.|406500484|62720|0|
11:35:26.809078|tcp|10.20.4.12|58802|10.20.6.40|443|P.|406500484|62720|903|
11:35:26.814183|tcp|10.20.6.40|443|10.20.4.12|58802|P.|146424376|29200|1692|
11:35:26.814483|tcp|10.20.4.12|58802|10.20.6.40|443|.|406501387|62720|0|
11:35:26.850196|tcp|10.20.4.12|58802|10.20.6.40|443|P.|406501387|62720|1386|
11:35:26.852494|tcp|10.20.6.40|443|10.20.4.12|58802|P.|146426068|29200|2291|
11:35:26.852794|tcp|10.20.4.12|58802|10.20.6.40|443|.|406502773|62720|0|
11:35:26.891199|tcp|10.20.4.12|58802|10.20.6.40|443|P.|406502773|62720|915|
11:35:26.895338|tcp|10.20.6.40|443|10.20.4.12|58802|P.|146428359|29200|2413|
11:35:26.895638|tcp|10.20.4.12|58802|10.20.6.40|443|.|406503688|62720|0|
11:35:26.906917|tcp|10.20.4.12|58802|10.20.6.40|443|P.|406503688|62720|877|
11:35:26.912042|tcp|10.20.6.40|443|10.20.4.12|58802|P.|146430772|29200|918|
11:35:26.912342|tcp|10.20.4.12|58802|10.20.6.40|443|.|406504565|62720|0|
11:35:26.969968|tcp|10.20.4.12|58802|10.20.6.40|443|P.|406504565|62720|853|
11:35:26.973517|tcp|10.20.6.40|443|10.20.4.12|58802|P.|146431690|29200|1347|
11:35:26.973817|tcp|10.20.4.12|58802|10.20.6.40|443|.|406505418|62720|0|
11:35:26.993817|tcp|10.20.4.12|58802|10.20.6.40|443|F.|406505418|62720|0|
11:35:26.994317|tcp|10.20.6.40|443|10.20.4.12|58802|F.|146433037|29200|0|
11:35:26.994517|tcp|10.20.4.12|58802|10.20.6.40|443|.|406505419|62720|0|
11:35:41.000000|tcp|10.20.6.40|57377|203.0.113.55|443|S|484447103|64240|0|
11:35:41.000607|tcp|203.0.113.55|443|10.20.6.40|57377|S.|412556934|64240|0|
11:35:41.001578|tcp|10.20.6.40|57377|203.0.113.55|443|.|484447104|64240|0|
11:35:41.040212|tcp|10.20.6.40|57377|203.0.113.55|443|P.|484447104|64240|210|TLS SNI: cdn-sync.example
11:35:41.045436|tcp|203.0.113.55|443|10.20.6.40|57377|P.|412556935|64240|335|
11:35:41.045736|tcp|10.20.6.40|57377|203.0.113.55|443|.|484447314|64240|0|
11:35:41.065736|tcp|10.20.6.40|57377|203.0.113.55|443|F.|484447314|64240|0|
11:35:41.066236|tcp|203.0.113.55|443|10.20.6.40|57377|F.|412557270|64240|0|
11:35:41.066436|tcp|10.20.6.40|57377|203.0.113.55|443|.|484447315|64240|0|
11:36:05.117397|udp|10.20.6.40|37739|10.20.1.10|53|q|19407|0|40|19407+ A? example.com.
11:36:05.120719|udp|10.20.1.10|53|10.20.6.40|37739|r|19407|0|56|19407 1/0/0 A 192.0.2.10
11:36:07.000000|tcp|10.20.9.40|56278|10.20.6.40|9100|S|3412267558|65535|0|
11:36:07.000583|tcp|10.20.6.40|9100|10.20.9.40|56278|S.|229803093|62720|0|
11:36:07.001086|tcp|10.20.9.40|56278|10.20.6.40|9100|.|3412267559|65535|0|
11:36:07.015083|tcp|10.20.9.40|56278|10.20.6.40|9100|P.|3412267559|65535|453|GET /metrics HTTP/1.1
11:36:07.020991|tcp|10.20.6.40|9100|10.20.9.40|56278|P.|229803094|62720|1714|
11:36:07.021291|tcp|10.20.9.40|56278|10.20.6.40|9100|.|3412268012|65535|0|
11:36:07.041291|tcp|10.20.9.40|56278|10.20.6.40|9100|F.|3412268012|65535|0|
11:36:07.041791|tcp|10.20.6.40|9100|10.20.9.40|56278|F.|229804808|62720|0|
11:36:07.041991|tcp|10.20.9.40|56278|10.20.6.40|9100|.|3412268013|65535|0|
11:36:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 49
11:36:31.000573|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 49
11:37:07.000000|tcp|10.20.9.40|37535|10.20.6.40|9100|S|153831319|62720|0|
11:37:07.000611|tcp|10.20.6.40|9100|10.20.9.40|37535|S.|24908882|29200|0|
11:37:07.000980|tcp|10.20.9.40|37535|10.20.6.40|9100|.|153831320|62720|0|
11:37:07.036646|tcp|10.20.9.40|37535|10.20.6.40|9100|P.|153831320|62720|543|GET /metrics HTTP/1.1
11:37:07.037952|tcp|10.20.6.40|9100|10.20.9.40|37535|P.|24908883|29200|710|
11:37:07.038252|tcp|10.20.9.40|37535|10.20.6.40|9100|.|153831863|62720|0|
11:37:07.058252|tcp|10.20.9.40|37535|10.20.6.40|9100|F.|153831863|62720|0|
11:37:07.058752|tcp|10.20.6.40|9100|10.20.9.40|37535|F.|24909593|29200|0|
11:37:07.058952|tcp|10.20.9.40|37535|10.20.6.40|9100|.|153831864|62720|0|
11:37:14.609667|udp|10.20.6.40|37434|10.20.1.10|53|q|51500|0|40|51500+ A? example.com.
11:37:14.613296|udp|10.20.1.10|53|10.20.6.40|37434|r|51500|0|56|51500 1/0/0 A 192.0.2.10
11:37:24.408667|tcp|10.20.4.12|54744|10.20.6.40|443|S|2961831302|65535|0|
11:37:24.409474|tcp|10.20.6.40|443|10.20.4.12|54744|S.|1431749796|62720|0|
11:37:24.410548|tcp|10.20.4.12|54744|10.20.6.40|443|.|2961831303|65535|0|
11:37:24.434284|tcp|10.20.4.12|54744|10.20.6.40|443|P.|2961831303|65535|1080|TLS SNI: portal.ridgelinemed.example
11:37:24.437049|tcp|10.20.6.40|443|10.20.4.12|54744|P.|1431749797|62720|1276|
11:37:24.437349|tcp|10.20.4.12|54744|10.20.6.40|443|.|2961832383|65535|0|
11:37:24.472621|tcp|10.20.4.12|54744|10.20.6.40|443|P.|2961832383|65535|1265|
11:37:24.477338|tcp|10.20.6.40|443|10.20.4.12|54744|P.|1431751073|62720|1950|
11:37:24.477638|tcp|10.20.4.12|54744|10.20.6.40|443|.|2961833648|65535|0|
11:37:24.518453|tcp|10.20.4.12|54744|10.20.6.40|443|P.|2961833648|65535|1146|
11:37:24.520665|tcp|10.20.6.40|443|10.20.4.12|54744|P.|1431753023|62720|1292|
11:37:24.520965|tcp|10.20.4.12|54744|10.20.6.40|443|.|2961834794|65535|0|
11:37:24.540965|tcp|10.20.4.12|54744|10.20.6.40|443|F.|2961834794|65535|0|
11:37:24.541465|tcp|10.20.6.40|443|10.20.4.12|54744|F.|1431754315|62720|0|
11:37:24.541665|tcp|10.20.4.12|54744|10.20.6.40|443|.|2961834795|65535|0|
11:38:07.000000|tcp|10.20.9.40|42332|10.20.6.40|9100|S|1162676347|65535|0|
11:38:07.001030|tcp|10.20.6.40|9100|10.20.9.40|42332|S.|3655593987|29200|0|
11:38:07.001616|tcp|10.20.9.40|42332|10.20.6.40|9100|.|1162676348|65535|0|
11:38:07.017634|tcp|10.20.9.40|42332|10.20.6.40|9100|P.|1162676348|65535|626|GET /metrics HTTP/1.1
11:38:07.021014|tcp|10.20.6.40|9100|10.20.9.40|42332|P.|3655593988|29200|1676|
11:38:07.021314|tcp|10.20.9.40|42332|10.20.6.40|9100|.|1162676974|65535|0|
11:38:07.041314|tcp|10.20.9.40|42332|10.20.6.40|9100|F.|1162676974|65535|0|
11:38:07.041814|tcp|10.20.6.40|9100|10.20.9.40|42332|F.|3655595664|29200|0|
11:38:07.042014|tcp|10.20.9.40|42332|10.20.6.40|9100|.|1162676975|65535|0|
11:38:12.157473|udp|10.20.6.40|59069|10.20.1.10|53|q|58718|0|63|58718+ A? rmg-backup-01.ridgelinemed.example.
11:38:12.161468|udp|10.20.1.10|53|10.20.6.40|59069|r|58718|0|79|58718 1/0/0 A 10.20.9.15
11:38:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 50
11:38:31.000323|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 50
11:38:57.437159|tcp|10.20.6.40|37583|192.0.2.10|443|S|2425408476|64240|0|
11:38:57.437707|tcp|192.0.2.10|443|10.20.6.40|37583|S.|3309893152|64240|0|
11:38:57.438280|tcp|10.20.6.40|37583|192.0.2.10|443|.|2425408477|64240|0|
11:38:57.470926|tcp|10.20.6.40|37583|192.0.2.10|443|P.|2425408477|64240|1069|TLS SNI: www.example.com
11:38:57.473771|tcp|192.0.2.10|443|10.20.6.40|37583|P.|3309893153|64240|2326|
11:38:57.474071|tcp|10.20.6.40|37583|192.0.2.10|443|.|2425409546|64240|0|
11:38:57.529838|tcp|10.20.6.40|37583|192.0.2.10|443|P.|2425409546|64240|786|
11:38:57.533320|tcp|192.0.2.10|443|10.20.6.40|37583|P.|3309895479|64240|1937|
11:38:57.533620|tcp|10.20.6.40|37583|192.0.2.10|443|.|2425410332|64240|0|
11:38:57.553620|tcp|10.20.6.40|37583|192.0.2.10|443|F.|2425410332|64240|0|
11:38:57.554120|tcp|192.0.2.10|443|10.20.6.40|37583|F.|3309897416|64240|0|
11:38:57.554320|tcp|10.20.6.40|37583|192.0.2.10|443|.|2425410333|64240|0|
11:39:07.000000|tcp|10.20.9.40|41441|10.20.6.40|9100|S|1327020043|65535|0|
11:39:07.001056|tcp|10.20.6.40|9100|10.20.9.40|41441|S.|836626431|64240|0|
11:39:07.001893|tcp|10.20.9.40|41441|10.20.6.40|9100|.|1327020044|65535|0|
11:39:07.042199|tcp|10.20.9.40|41441|10.20.6.40|9100|P.|1327020044|65535|464|GET /metrics HTTP/1.1
11:39:07.046776|tcp|10.20.6.40|9100|10.20.9.40|41441|P.|836626432|64240|800|
11:39:07.047076|tcp|10.20.9.40|41441|10.20.6.40|9100|.|1327020508|65535|0|
11:39:07.067076|tcp|10.20.9.40|41441|10.20.6.40|9100|F.|1327020508|65535|0|
11:39:07.067576|tcp|10.20.6.40|9100|10.20.9.40|41441|F.|836627232|64240|0|
11:39:07.067776|tcp|10.20.9.40|41441|10.20.6.40|9100|.|1327020509|65535|0|
11:39:12.377559|udp|10.20.6.40|59898|10.20.1.10|53|q|18996|0|39|18996+ A? ubuntu.com.
11:39:12.379899|udp|10.20.1.10|53|10.20.6.40|59898|r|18996|0|55|18996 1/0/0 A 192.0.2.30
11:40:07.000000|tcp|10.20.9.40|47043|10.20.6.40|9100|S|2400596108|65535|0|
11:40:07.001014|tcp|10.20.6.40|9100|10.20.9.40|47043|S.|1024649436|29200|0|
11:40:07.001312|tcp|10.20.9.40|47043|10.20.6.40|9100|.|2400596109|65535|0|
11:40:07.048881|tcp|10.20.9.40|47043|10.20.6.40|9100|P.|2400596109|65535|859|GET /metrics HTTP/1.1
11:40:07.051743|tcp|10.20.6.40|9100|10.20.9.40|47043|P.|1024649437|29200|553|
11:40:07.052043|tcp|10.20.9.40|47043|10.20.6.40|9100|.|2400596968|65535|0|
11:40:07.072043|tcp|10.20.9.40|47043|10.20.6.40|9100|F.|2400596968|65535|0|
11:40:07.072543|tcp|10.20.6.40|9100|10.20.9.40|47043|F.|1024649990|29200|0|
11:40:07.072743|tcp|10.20.9.40|47043|10.20.6.40|9100|.|2400596969|65535|0|
11:40:12.023302|udp|10.20.6.40|37168|10.20.1.10|53|q|40897|0|63|40897+ A? rmg-backup-01.ridgelinemed.example.
11:40:12.026565|udp|10.20.1.10|53|10.20.6.40|37168|r|40897|0|79|40897 1/0/0 A 10.20.9.15
11:40:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 51
11:40:31.000619|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 51
11:40:41.000000|tcp|10.20.6.40|55399|203.0.113.55|443|S|534295556|62720|0|
11:40:41.000547|tcp|203.0.113.55|443|10.20.6.40|55399|S.|1505443702|62720|0|
11:40:41.000969|tcp|10.20.6.40|55399|203.0.113.55|443|.|534295557|62720|0|
11:40:41.042868|tcp|10.20.6.40|55399|203.0.113.55|443|P.|534295557|62720|268|TLS SNI: cdn-sync.example
11:40:41.046295|tcp|203.0.113.55|443|10.20.6.40|55399|P.|1505443703|62720|651|
11:40:41.046595|tcp|10.20.6.40|55399|203.0.113.55|443|.|534295825|62720|0|
11:40:41.066595|tcp|10.20.6.40|55399|203.0.113.55|443|F.|534295825|62720|0|
11:40:41.067095|tcp|203.0.113.55|443|10.20.6.40|55399|F.|1505444354|62720|0|
11:40:41.067295|tcp|10.20.6.40|55399|203.0.113.55|443|.|534295826|62720|0|
11:41:07.000000|tcp|10.20.9.40|55203|10.20.6.40|9100|S|103613317|64240|0|
11:41:07.000501|tcp|10.20.6.40|9100|10.20.9.40|55203|S.|2558353643|29200|0|
11:41:07.001541|tcp|10.20.9.40|55203|10.20.6.40|9100|.|103613318|64240|0|
11:41:07.050684|tcp|10.20.9.40|55203|10.20.6.40|9100|P.|103613318|64240|490|GET /metrics HTTP/1.1
11:41:07.054207|tcp|10.20.6.40|9100|10.20.9.40|55203|P.|2558353644|29200|693|
11:41:07.054507|tcp|10.20.9.40|55203|10.20.6.40|9100|.|103613808|64240|0|
11:41:07.074507|tcp|10.20.9.40|55203|10.20.6.40|9100|F.|103613808|64240|0|
11:41:07.075007|tcp|10.20.6.40|9100|10.20.9.40|55203|F.|2558354337|29200|0|
11:41:07.075207|tcp|10.20.9.40|55203|10.20.6.40|9100|.|103613809|64240|0|
11:41:21.642961|udp|10.20.6.40|48102|10.20.1.10|53|q|5680|0|64|5680+ A? rmg-monitor-01.ridgelinemed.example.
11:41:21.645538|udp|10.20.1.10|53|10.20.6.40|48102|r|5680|0|80|5680 1/0/0 A 10.20.9.40
11:42:07.000000|tcp|10.20.9.40|56718|10.20.6.40|9100|S|2854334232|62720|0|
11:42:07.001334|tcp|10.20.6.40|9100|10.20.9.40|56718|S.|2769877873|65535|0|
11:42:07.002098|tcp|10.20.9.40|56718|10.20.6.40|9100|.|2854334233|62720|0|
11:42:07.044945|tcp|10.20.9.40|56718|10.20.6.40|9100|P.|2854334233|62720|829|GET /metrics HTTP/1.1
11:42:07.046197|tcp|10.20.6.40|9100|10.20.9.40|56718|P.|2769877874|65535|464|
11:42:07.046497|tcp|10.20.9.40|56718|10.20.6.40|9100|.|2854335062|62720|0|
11:42:07.066497|tcp|10.20.9.40|56718|10.20.6.40|9100|F.|2854335062|62720|0|
11:42:07.066997|tcp|10.20.6.40|9100|10.20.9.40|56718|F.|2769878338|65535|0|
11:42:07.067197|tcp|10.20.9.40|56718|10.20.6.40|9100|.|2854335063|62720|0|
11:42:29.336980|udp|10.20.6.40|51301|10.20.1.10|53|q|4092|0|64|4092+ A? rmg-monitor-01.ridgelinemed.example.
11:42:29.339926|udp|10.20.1.10|53|10.20.6.40|51301|r|4092|0|80|4092 1/0/0 A 10.20.9.40
11:42:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 52
11:42:31.000398|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 52
11:43:07.000000|tcp|10.20.9.40|33441|10.20.6.40|9100|S|130076567|64240|0|
11:43:07.000981|tcp|10.20.6.40|9100|10.20.9.40|33441|S.|899755974|62720|0|
11:43:07.001357|tcp|10.20.9.40|33441|10.20.6.40|9100|.|130076568|64240|0|
11:43:07.012605|tcp|10.20.9.40|33441|10.20.6.40|9100|P.|130076568|64240|687|GET /metrics HTTP/1.1
11:43:07.015838|tcp|10.20.6.40|9100|10.20.9.40|33441|P.|899755975|62720|915|
11:43:07.016138|tcp|10.20.9.40|33441|10.20.6.40|9100|.|130077255|64240|0|
11:43:07.036138|tcp|10.20.9.40|33441|10.20.6.40|9100|F.|130077255|64240|0|
11:43:07.036638|tcp|10.20.6.40|9100|10.20.9.40|33441|F.|899756890|62720|0|
11:43:07.036838|tcp|10.20.9.40|33441|10.20.6.40|9100|.|130077256|64240|0|
11:43:37.805002|udp|10.20.6.40|37480|10.20.1.10|53|q|55813|0|40|55813+ A? example.com.
11:43:37.807644|udp|10.20.1.10|53|10.20.6.40|37480|r|55813|0|56|55813 1/0/0 A 192.0.2.10
11:44:07.000000|tcp|10.20.9.40|56337|10.20.6.40|9100|S|1193390257|62720|0|
11:44:07.000638|tcp|10.20.6.40|9100|10.20.9.40|56337|S.|3666949898|29200|0|
11:44:07.001298|tcp|10.20.9.40|56337|10.20.6.40|9100|.|1193390258|62720|0|
11:44:07.015562|tcp|10.20.9.40|56337|10.20.6.40|9100|P.|1193390258|62720|807|GET /metrics HTTP/1.1
11:44:07.019765|tcp|10.20.6.40|9100|10.20.9.40|56337|P.|3666949899|29200|1189|
11:44:07.020065|tcp|10.20.9.40|56337|10.20.6.40|9100|.|1193391065|62720|0|
11:44:07.040065|tcp|10.20.9.40|56337|10.20.6.40|9100|F.|1193391065|62720|0|
11:44:07.040565|tcp|10.20.6.40|9100|10.20.9.40|56337|F.|3666951088|29200|0|
11:44:07.040765|tcp|10.20.9.40|56337|10.20.6.40|9100|.|1193391066|62720|0|
11:44:19.894792|udp|10.20.6.40|39244|10.20.1.10|53|q|57871|0|63|57871+ A? rmg-backup-01.ridgelinemed.example.
11:44:19.898299|udp|10.20.1.10|53|10.20.6.40|39244|r|57871|0|79|57871 1/0/0 A 10.20.9.15
11:44:31.000000|icmp|10.20.9.40|0|10.20.6.40|0|echo-request|10178|0|64|id 10178, seq 53
11:44:31.000656|icmp|10.20.6.40|0|10.20.9.40|0|echo-reply|10178|0|64|id 10178, seq 53`;
